const { addChild, updateChild, deleteChild } = require("./childController");
const { moveFileInS3, copyFileInS3, deleteFileInS3, renameFileInS3 } = require('./fileController');
const { s3 } = require('../config/s3Client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRequest = async (req, res) => {
    const requestid = req.params.requestId;

    try {
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })
        if (!request) return res.status(404).json({ success: false, message: 'Resource not found' });
        //check if user is authorized to view request
        if (request.sender_id !== req.userId && request.receiver_id !== req.userId) return res.sendStatus(401);

        let data;
        if (request.entity == 'child') {
            data = await prisma.child_temp.findUnique({
                where: {
                    childid: request.entity_key
                }
            })
        }
        console.log('child', data)

        res.status(200).json({
            success: true,
            request,
            data
        })
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching request.'
        });
    }

}

const getSentRequests = async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            where: {
                sender_id: req.userId
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })
        res.status(200).json({
            success: true,
            requests: requests
        })
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching requests.'
        });
    }
}

const getReceivedRequests = async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            where: {
                receiver_id: req.userId
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })
        res.status(200).json({
            success: true,
            requests: requests
        })
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching requests.'
        });
    }
}

const createAddChildRequest = async (req, res) => {
    const { orphanageid } = req.body;
    //check if orphanageid is present and user is authorized to create request
    if ((!req?.orphanageid) || (orphanageid !== req.orphanageid)) {
        return res.status(401).status({ success: false, message: 'Unauthorized' });
    }

    try {
        //fetch receiver from database
        const receiverOrphanage = await prisma.orphanage.findUnique({
            where: {
                orphanageid: orphanageid
            },
            select: { headid: true }
        })
        //check if receiver orphanage exists
        if (!receiverOrphanage) return res.status(404).json({ success: false, message: 'Resource not found' });
        //create request in database
        const result = await prisma.$transaction(async (prisma) => {

            const temp_child = await prisma.child_temp.create({
                data: req.body,
                select: {
                    childid: true
                }
            });

            const newRequest = await prisma.request.create({
                data: {
                    type: 'create',
                    entity: 'child',
                    entity_key: temp_child.childid,
                    receiver_id: receiverOrphanage.headid,
                    sender_id: req.userId
                },
                select: {
                    requestid: true,
                    type: true,
                    entity: true,
                    status: true,
                    created_at: true
                }
            })
            return newRequest;
        })

        res.status(200).json({
            success: true,
            message: 'Request created successfully.',
            data: result
        })
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const handleAddChildRequest = async (req, res) => {
    const { requestid, response } = req.body;
    console.log(requestid, response);
    //check if requestid and response are present
    if (!requestid || !response) return res.status(400).json({ 'success': false, message: 'Bad request' });

    try {
        //fetch request from database
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })
        //check if request exists
        if (!request) return res.status(404).json({ 'success': false, message: 'Resource not found' });
        //check if request is of type create and entity is child
        if (request.type !== 'create' || request.entity !== 'child' || request.status === 'approved' || request.status === 'rejected') return res.sendStatus(400);
        //check if user is authorized to handle request
        if (request.receiver_id !== req.userId) return res.status(401).json({ 'success': false, message: 'Unauthorized' });
        //if request is accepted, add child
        let result;
        console.log(request.entity_key)

        if (response === 'approved') {

            req.body = await prisma.child_temp.findUnique({
                where: {
                    childid: request.entity_key
                }
            })
            result = await addChild(req);
            if (result === 500) return res.status(result).json({ success: false, message: 'An error occurred' });
            else if (result === 401) return res.status(result).json({ success: false, message: 'Unauthorized' });

            const params = {
                Bucket: process.env.S3_BUCKET,
                Prefix: `request/photo/${requestid}`, // Search for objects with this prefix
                MaxKeys: 1 // Limit the number of keys returned
            };

            const data = await s3.listObjectsV2(params).promise();
            if (data.Contents.length > 0) {
                const destinationKey = `child/photo/${result.childid}.` + data.Contents[0].Key.split('.').pop();
                copyFileInS3(data.Contents[0].Key, destinationKey);
            }

        }
        //update request with response
        const updatedRequest = await prisma.request.update({
            where: {
                requestid: requestid
            },
            data: {
                status: response
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })

        res.status(200).json({ 'success': true, data: updatedRequest });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const createEditChildRequest = async (req, res) => {
    const { childid } = req.body;  //extracting childid from request
    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            },
            include: {
                orphanage: {
                    select: {
                        headid: true
                    }
                }
            }
        })
        console.log(child)

        if (!child) return res.status(404).json({ success: false, message: 'Resource not found' });

        if ((!req.orphanageid) || (child.orphanageid !== req.orphanageid)) return res.status(401).json({ 'success': false, message: 'Unauthorized' });

        let newRequest;
        await prisma.$transaction(async (prisma) => {

            const newChild = await prisma.child_temp.create({
                data: {
                    orphanageid: req.orphanageid,
                    name: req.body.name,
                    date_of_birth: new Date(req.body.date_of_birth),
                    gender: req.body.gender,
                    religion: req.body.religion,
                    nationality: req.body.nationality,
                    medicaldetails: req.body.medicaldetails,
                    educationaldetails: req.body.educationaldetails,
                }
            })
            newRequest = await prisma.request.create({
                data: {
                    type: 'update',
                    entity: 'child',
                    entity_key: newChild.childid,
                    receiver_id: child.orphanage.headid,
                    sender_id: req.userId,
                    target_key: childid
                },
                select: {
                    requestid: true,
                    type: true,
                    entity: true,
                    status: true,
                    created_at: true
                }
            })


        })

        res.status(200).json({
            success: true,
            message: 'Request created successfully.',
            data: newRequest
        })

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const handleEditChildRequest = async (req, res) => {
    const { requestid, response } = req.body;
    //check if requestid and response are present
    if (!requestid || !response) return res.status(400).json({ 'success': false, message: 'Bad request' });

    try {
        //fetch request from database
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })
        //check if request exists
        if (!request) return res.sendStatus(404);
        //check if request is of type update and entity is child
        if (request.type !== 'update' || request.entity !== 'child' || request.status === 'approved' || request.status === 'rejected') return res.sendStatus(400);
        //check if user is authorized to handle request
        if (request.receiver_id !== req.userId) return res.status(401).json({ 'success': false, message: 'Unauthorized' });
        //if request is accepted, update child
        if (response === 'approved') {

            const childid = request.target_key;
            const child = await prisma.child_temp.findUnique({
                where: {
                    childid: request.entity_key
                },
                select: {
                    name: true,
                    date_of_birth: true,
                    gender: true,
                    religion: true,
                    nationality: true,
                    medicaldetails: true,
                    educationaldetails: true,

                }
            });
            req.body = { childid, ...child };
            const result = await updateChild(req);
            if (result === 500) return res.status(result).json({ 'success': false, message: 'An error occurred' });
            else if (result === 401) return res.status(result).json({ 'success': false, message: 'Unauthorized' });
            else if (result === 404) return res.status(result).json({ 'success': false, message: 'Resource not found' });
        }
        //update request with response
        const updatedRequest = await prisma.request.update({
            where: {
                requestid: requestid
            },
            data: {
                status: response
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })

        res.status(200).json({ success: true, data: updatedRequest });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred '
        });
    }
}

const createDeleteChildRequest = async (req, res) => {
    const { childid } = req.body;
    console.log(req.body)

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            },
            include: {
                orphanage: {
                    select: {
                        orphanageid: true,
                        headid: true
                    }
                }
            }
        })

        if (!child) return res.status(404).json({
            success: false,
            message: 'Resource not found'
        });

        if ((!req.orphanageid) || (child.orphanage.orphanageid !== req.orphanageid)) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        let newRequest;

        await prisma.$transaction(async (prisma) => {

            const temp_child = await prisma.child_temp.create({
                data: req.body,
                select: {
                    childid: true
                }
            });

            newRequest = await prisma.request.create({
                data: {
                    type: 'delete',
                    entity: 'child',
                    entity_key: temp_child.childid,
                    receiver_id: child.orphanage.headid,
                    sender_id: req.userId,
                    target_key: childid
                },
                select: {
                    requestid: true,
                    type: true,
                    entity: true,
                    status: true,
                    created_at: true
                }
            })
        })

        res.status(200).json({
            success: true,
            message: 'Request created successfully.',
            data: newRequest
        })

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating request.'
        });
    }
}

const handleDeleteChildRequest = async (req, res) => {
    //consistency issue in temp_docs
    const { requestid, response } = req.body;
    //check if requestid and response are present
    if (!requestid || !response) return res.status(400).json({ 'success': false, message: 'Bad Request' });

    try {
        //fetch request from database
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })
        //check if request exists
        if (!request) return res.status(404).json({ 'success': false, message: 'Resource not found' });
        //check if request is of type delete and entity is child
        if (request.type !== 'delete' || request.entity !== 'child' || request.status === 'approved' || request.status === 'rejected') return res.sendStatus(400);
        //check if user is authorized to handle request
        if (request.receiver_id !== req.userId) return res.status(401).json({ 'success': false, message: 'Unauthorized' });
        //if request is accepted, delete child
        if (response === 'approved') {

            req.body = { childid: request.target_key };

            const result = await deleteChild(req);
            if (result === 500) return res.status(result).json({ 'success': false, message: 'An error occurred' });
            else if (result === 404) return res.status(result).json({ 'success': false, message: 'Resource not found' });

            //check if document exists in s3 bucket
            const params = {
                Bucket: process.env.S3_BUCKET,
                Prefix: `child/photo/${req.body.childid}`, // Search for objects with this prefix
                MaxKeys: 1 // Limit the number of keys returned
            };

            const data = await s3.listObjectsV2(params).promise();
            if (data.Contents.length != 0) {
                deleteFileInS3(data.Contents[0].Key);
            }
        }
        //update request with response
        const updatedRequest = await prisma.request.update({
            where: {
                requestid: requestid
            },
            data: {
                status: response
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })

        res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const createChildDocumentRequest = async (req, res) => {

    const { childid,
        document_type,
        document_name,
        tempId } = req.body;

    try {
        //fetch child from database
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            },
            include: {
                orphanage: {
                    select: {
                        orphanageid: true,
                        headid: true
                    }
                }
            }
        })

        //check if orphanageid is present and user is authorized to create request
        if ((!req?.orphanageid) || (child.orphanage.orphanageid !== req.orphanageid)) {
            return res.status(401).status({ success: false, message: 'Unauthorized' });
        }
        //for consistency
        await prisma.$transaction(async (prisma) => {
            //create temp document data in database
            const newDocument = await prisma.child_document_temp.create({
                data: {
                    childid: childid,
                    document_type: document_type,
                    document_name: document_name
                },
                select: {
                    documentid: true,
                }
            })
            //create request in database
            await prisma.request.create({
                data: {
                    type: 'create',
                    entity: 'document',
                    entity_key: newDocument.documentid,
                    sender_id: req.userId,
                    receiver_id: child.orphanage.headid
                }
            });
            //rename temp document in s3 bucket
            await renameFileInS3(`request/document/${tempId}.pdf`, `request/document/${newDocument.documentid}.pdf`);

        })

        res.status(200).json({
            success: true,
            message: 'Request created successfully.'
        })

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const handleChildDocumentRequest = async (req, res) => {
    const { requestid, response } = req.body;
    //check if requestid and response are present
    if (!requestid || !response) return res.status(400).json({ 'success': false, message: 'Bad request' });

    try {
        //fetch request from database
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })

        //check if request exists
        if (!request) return res.status(404).json({ 'success': false, message: 'Resource not found' });
        //check if request is of type create and entity is document
        if (request.type !== 'create' || request.entity !== 'document' || request.status === 'approved' || request.status === 'rejected') return res.sendStatus(400);
        //check if user is authorized to handle request
        if (request.receiver_id !== req.userId) return res.status(401).json({ 'success': false, message: 'Unauthorized' });
        //if request is accepted, add document
        if (response === 'approved') {

            const documentId = request.entity_key;

            const document = await prisma.child_document_temp.findUnique({
                where: {
                    documentid: documentId
                }
            })

            await prisma.child_document.create({
                data: document
            });

            copyFileInS3(`request/document/${documentId}.pdf`, `child/document/${documentId}.pdf`);

        }

        const updatedRequest = await prisma.request.update({
            where: {
                requestid: requestid
            },
            data: {
                status: response
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })

        res.status(200).json({ 'success': true, data: updatedRequest });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }
}

const deleteChildDocumentRequest = async (req, res) => {
    const { documentId } = req.body;
    console.log('docId', documentId)
    try {
        const document = await prisma.child_document.findUnique({
            where: {
                documentid: documentId
            },
            include: {
                child: {
                    include: {
                        orphanage: {
                            select: {
                                headid: true
                            }
                        }
                    }
                }
            }
        })

        if (!document) return res.status(404).json({
            success: false,
            message: 'Resource not found'
        });

        if ((!req.orphanageid) || (document.child.orphanageid !== req.orphanageid)) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        await prisma.request.create({
            data: {
                type: 'delete',
                entity: 'document',
                entity_key: documentId,
                receiver_id: document.child.orphanage.headid,
                sender_id: req.userId
            }
        })

        res.status(200).json({
            success: true,
            message: 'Request created successfully.'
        })

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating request.'
        });
    }
}

const handleDeleteDocumentRequest = async (req, res) => {
    const { requestid, response } = req.body;
    //check if requestid and response are present
    if (!requestid || !response) return res.status(400).json({ 'success': false, message: 'Bad Request' });

    try {
        //fetch request from database
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestid
            }
        })
        console.log(request)

        //check if request exists
        if (!request) return res.status(404).json({ 'success': false, message: 'Resource not found' });
        //check if request is of type delete and entity is document
        if (request.type !== 'delete' || request.entity !== 'document' || request.status === 'approved' || request.status === 'rejected') return res.sendStatus(400);
        //check if user is authorized to handle request
        if (request.receiver_id !== req.userId) return res.status(401).json({ 'success': false, message: 'Unauthorized' });
        //if request is accepted, delete document
        if (response === 'approved') {

            const documentId = request.entity_key;
            console.log(request)

            await prisma.child_document.delete({
                where: {
                    documentid: documentId
                }
            })

            deleteFileInS3(`child/document/${documentId}.pdf`);

        }

        const updatedRequest = await prisma.request.update({
            where: {
                requestid: requestid
            },
            data: {
                status: response
            },
            select: {
                requestid: true,
                type: true,
                entity: true,
                status: true,
                created_at: true
            }
        })

        res.status(200).json({ success: true, data: updatedRequest });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    }


}

module.exports = {
    getRequest,
    createAddChildRequest,
    handleAddChildRequest,
    createEditChildRequest,
    handleEditChildRequest,
    createDeleteChildRequest,
    handleDeleteChildRequest,
    getSentRequests,
    getReceivedRequests,
    createChildDocumentRequest,
    handleChildDocumentRequest,
    deleteChildDocumentRequest,
    handleDeleteDocumentRequest
};