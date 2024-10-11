const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { client, s3 } = require('../config/s3Client');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient, document_type } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

const getChildPhotoUploadURL = async (req, res) => {

    const requestId = req.params.path.split('.')[0];
    const type = req.params.path.split('.')[1];
    const userId = req.userId;

    if (!requestId || !type) return res.status(400).json({
        success: false,
        message: 'Invalid request'
    });

    try {
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestId
            },
            select: {
                sender_id: true
            }
        })

        if (!request) return res.status(404).json({
            success: false,
            message: 'Request not found'
        });

        if (request.sender_id !== userId) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        const URL = await getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `request/photo/${requestId}.${type}`,
            }),
            { expiresIn: 1000 * 60 });

        if (URL) {
            res.status(200).json({
                success: true,
                URL
            });
            console.log('URL:', URL);
        } else throw new Error('Failed to get upload URL');

    } catch (error) {
        console.error('Error getting upload URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get upload URL'
        });
    }
}

const getChildPhotoUpdateURL = async (req, res) => {
    const childId = req.params.path.split('.')[0];
    const type = req.params.path.split('.')[1];
    const userId = req.userId;

    if (!childId || !type) return res.status(400).json({
        success: false,
        message: 'Invalid request'
    });

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childId
            },
            select: {
                childid: true
            }
        })

        if (!child) return res.status(404).json({
            success: false,
            message: 'Child not found'
        });

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `child/photo/${childId}`, // Search for objects with this prefix
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents.length != 0) {
            for (let i = 0; i < data.Contents.length; i++) {
                console.log(i)
                if (data.Contents[i] != `child/photo/${childId}.${type}`) {
                    deleteFileInS3(data.Contents[i].Key);
                }
            }
        }

        const URL = await getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `child/photo/${childId}.${type}`,
            }),
            { expiresIn: 1000 * 60 });

        if (URL) {
            res.status(200).json({
                success: true,
                URL
            });
        } else throw new Error('Failed to get upload URL');

    } catch (error) {
        console.error('Error getting upload URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get upload URL'
        });
    }
}

const deleteChildPhoto = async (req, res) => {
    const childId = req.params.path
    if (!childId) return res.status(400).json({
        success: false,
        message: 'Invalid request'
    });

    try {

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `child/photo/${childId}`, // Search for objects with this prefix
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents.length != 0) {
            for (let i = 0; i < data.Contents.length; i++) {
                console.log(i)
                deleteFileInS3(data.Contents[i].Key);
            }
        }

        res.sendStatus(200)

    } catch (error) {
        console.error('Error deleting img:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting img'
        });
    }
}


const getChildDocUploadURL = async (req, res) => {

    const childId = req.params.childId;
    const orphanageId = req.orphanageid;
    console.log('childId:', childId, 'orphanageId:', orphanageId);

    if (!childId) return res.status(400).json({
        success: false,
        message: 'Invalid request'
    });

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childId
            },
            select: {
                orphanageid: true
            }
        })

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        if (!orphanageId || child.orphanageid !== orphanageId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const tempId = uuidv4();
        const URL = await getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `request/document/${tempId}.pdf`,
            }),
            { expiresIn: 1000 * 60 });

        if (URL) {
            res.status(200).json({
                success: true,
                URL,
                tempId: tempId
            });
            console.log('URL:', URL, 'tempId:', tempId);
        } else throw new Error('Failed to get upload URL');

    } catch (error) {
        console.error('Error getting upload URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get upload URL'
        });
    }
}

const getChildPhotoDownloadURL = async (req, res) => {
    const childId = req.params.childId;
    const orphanageId = req.orphanageid;

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childId
            },
            select: {
                orphanageid: true
            }
        });

        if (!child) return res.status(404).json({
            success: false,
            message: 'Child not found'
        });

        if (child.orphanageid !== orphanageId) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `child/photo/${childId}`, // Search for objects with this prefix
            MaxKeys: 1 // Limit the number of keys returned
        };

        const data = await s3.listObjectsV2(params).promise();
        console.log('data:', data.Contents);
        //if a photo is not in S3
        if (data.Contents.length === 0) {
            return res.status(200).json({
                success: true,
                URL: null
            });
        }

        console.log('data:', data.Contents[0].Key);

        const URL = await getSignedUrl(
            client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: data.Contents[0].Key,
            }),
            { expiresIn: 1000 * 60 });

        if (URL) {
            res.status(200).json({
                success: true,
                URL
            });
            console.log('URL:', URL);
        } else throw new Error('Failed to get download URL');

    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get download URL'
        });
    }
}

const getRequestPhotoDownloadURL = async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.userId;

    console.log('requestId:', requestId);

    try {
        const request = await prisma.request.findUnique({
            where: {
                requestid: requestId
            },
            select: {
                sender_id: true,
                receiver_id: true
            }
        });

        if (!request) return res.status(404).json({
            success: false,
            message: 'Child not found'
        });

        if ((request.sender_id !== userId) && (request.receiver_id !== userId)) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `request/photo/${requestId}`, // Search for objects with this prefix
            MaxKeys: 1 // Limit the number of keys returned
        };

        const data = await s3.listObjectsV2(params).promise();
        console.log('data:', data.Contents);
        //if a photo is not in S3
        if (data.Contents.length === 0) {
            return res.status(200).json({
                success: true,
                URL: null
            });
        }

        console.log('data:', data.Contents[0].Key);

        const URL = await getSignedUrl(
            client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: data.Contents[0].Key,
            }),
            { expiresIn: 1000 * 60 });

        if (URL) {
            res.status(200).json({
                success: true,
                URL
            });
            console.log('URL:', URL);
        } else throw new Error('Failed to get download URL');

    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get download URL'
        });
    }
}

/// Get a signed URL to download a child document that is not approved yet
const getTempDocumentURL = async (req, res) => {

    const documentId = req.params.documentId;
    const orphanageId = req.orphanageid;

    console.log('documentId:', documentId);

    try {
        const document = await prisma.child_document_temp.findUnique({
            where: {
                documentid: documentId
            },
            include: {
                child: {
                    include: {
                        orphanage: true
                    }
                }
            }
        });

        if (!document) return res.status(404).json({
            success: false,
            message: 'Document not found'
        });

        if (document.child.orphanage.orphanageid !== orphanageId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const URL = await getSignedUrl(
            client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `request/document/${documentId}.pdf`,
            }),
            { expiresIn: 1000 * 60 });

        delete document.child.orphanage;

        if (URL) {
            res.status(200).json({
                success: true,
                URL,
                document: {
                    childId: document.childid,
                    document_type: document.document_type,
                    document_name: document.document_name,
                    created_at: document.created_at
                },
                child: document.child
            });
            console.log('URL:', URL);
        } else throw new Error('Failed to get download URL');

    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get download URL'
        });
    }
}

const getChildDocumentURL = async (req, res) => {

    const documentId = req.params.documentId;
    const orphanageId = req.orphanageid;

    console.log('documentId:', documentId);

    try {
        const document = await prisma.child_document_temp.findUnique({
            where: {
                documentid: documentId
            },
            include: {
                child: {
                    include: {
                        orphanage: true
                    }
                }
            }
        });

        if (!document) return res.status(404).json({
            success: false,
            message: 'Document not found'
        });

        if (document.child.orphanage.orphanageid !== orphanageId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const URL = await getSignedUrl(
            client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `child/document/${documentId}.pdf`,
            }),
            { expiresIn: 1000 * 60 });

        delete document.child.orphanage;

        if (URL) {
            res.status(200).json({
                success: true,
                URL,
                document: {
                    childId: document.childid,
                    document_type: document.document_type,
                    document_name: document.document_name,
                    created_at: document.created_at
                },
                child: document.child
            });
            console.log('URL:', URL);
        } else throw new Error('Failed to get download URL');

    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get download URL'
        });
    }
}


/// Move a file from one location to another in S3
const moveFileInS3 = async (sourceKey, destinationKey) => {
    const bucketName = process.env.S3_BUCKET;

    // Step 1: Copy the object to the new location
    await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`,
        Key: destinationKey
    }).promise();

    console.log(`File copied from ${sourceKey} to ${destinationKey}`);

    // Step 2: Delete the original object
    await s3.deleteObject({
        Bucket: bucketName,
        Key: sourceKey
    }).promise();

    console.log(`File deleted from ${sourceKey}`);

}

/// Move a file from one location to another in S3
const copyFileInS3 = async (sourceKey, destinationKey) => {

    const bucketName = process.env.S3_BUCKET;
    // Step 1: Copy the object to the new location
    await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`,
        Key: destinationKey
    }).promise();

    console.log(`File copied from ${sourceKey} to ${destinationKey}`);

}

const deleteFileInS3 = async (sourceKey) => {

    const bucketName = process.env.S3_BUCKET;

    await s3.deleteObject({
        Bucket: bucketName,
        Key: sourceKey
    }).promise();
}

const renameFileInS3 = async (sourceKey, destinationKey) => {
    const bucketName = process.env.S3_BUCKET;

    // Step 1: Copy the object to the new location
    await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`,
        Key: destinationKey
    }).promise();

    console.log(`File copied from ${sourceKey} to ${destinationKey}`);

    // Step 2: Delete the original object
    await s3.deleteObject({
        Bucket: bucketName,
        Key: sourceKey
    }).promise();

    console.log(`File deleted from ${sourceKey}`);
}


const uploadDocuments = async (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            success: false,
            message: 'No files were uploaded.'
        });
    }

    const { marriageCertificate, incomeCertificate, birthCertificate } = req.files;

    if (!marriageCertificate || !incomeCertificate || !birthCertificate) {
        return res.status(400).json({
            success: false,
            message: 'All documents must be provided.'
        });
    }

    try {
        const caseId = req.body.caseId;
        if (!caseId) {
            return res.status(400).json({
                success: false,
                message: 'Case ID is required.'
            });
        }


        const sw = await prisma.cases.findUnique({
            where: { caseid: caseId },
            select: {
                socialworkerid: true
            }
        })


        const notification = `Documents of case: ${caseId} uploaded `

        await prisma.users.update({
            where: {
                userid: sw.socialworkerid
            },
            data: {
                notifications: {
                    push: notification
                }
            }
        })











        const uploadPromises = [
            { file: marriageCertificate, name: 'marriageCertificate' },
            { file: incomeCertificate, name: 'incomeCertificate' },
            { file: birthCertificate, name: 'birthCertificate' }
        ].map(({ file, name }) => {
            const key = `cases/${caseId}/${name}/${file.name}`;
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: key,
                Body: file.data,
                ContentType: file.mimetype,
            };


            return client.send(new PutObjectCommand(params));
        });


        await Promise.all(uploadPromises);
        const setDocuments = await prisma.cases.update({
            where: { caseid: caseId },
            data: {
                documents: {
                    marriageCertificate: marriageCertificate.name,
                    incomeCertificate: incomeCertificate.name,
                    birthCertificate: birthCertificate.name
                }
            }
        });




        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully!'
        });
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload documents'
        });
    }
}

const getDocumentUrls = async (req, res) => {
    try {
        const { caseId } = req.query;

        if (!caseId) {
            return res.status(400).json({
                success: false,
                message: 'Case ID is required.'
            });
        }

        const caseData = await prisma.cases.findUnique({
            where: { caseid: caseId },
            select: {
                documents: true
            }
        });

        if (!caseData || !caseData.documents) {
            return res.status(404).json({
                success: false,
                message: 'Case not found or no documents associated.'
            });
        }

        const documents = caseData.documents; // Document object from Prisma
        console.log('Query Parameters:', req.query);

        const urls = await Promise.all(Object.entries(documents).map(async ([docType, fileName]) => {
            const key = `cases/${caseId}/${docType}/${fileName}`;
            console.log(`Generating URL for key: ${key}`);

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: key
            });

            const url = await getSignedUrl(client, command, { expiresIn: 3600 });

            return { name: docType, url };
        }));

        res.status(200).json({
            success: true,
            documents: urls
        });

    } catch (error) {
        console.log('Error generating document URLs:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get document URLs'
        });
    }
};

module.exports = {
    moveFileInS3,
    copyFileInS3,
    getChildPhotoUploadURL,
    getChildDocUploadURL,
    getChildPhotoDownloadURL,
    getRequestPhotoDownloadURL,
    getTempDocumentURL,
    getChildDocumentURL,
    deleteFileInS3,
    uploadDocuments,
    renameFileInS3,
    getDocumentUrls,
    getChildPhotoUpdateURL,
    deleteChildPhoto
};