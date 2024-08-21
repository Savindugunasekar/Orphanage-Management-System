const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { client, s3 } = require('../config/s3Client');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
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
                sender: true
            }
        })

        if (!request) return res.status(404).json({
            success: false,
            message: 'Request not found'
        });

        if (request.sender !== userId) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        const URL = await getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `request/${requestId}.${type}`,
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

const getChildDocUploadURL = async (req, res) => {

    const documentId = req.params.path.split('.')[0];
    const type = req.params.path.split('.')[1];
    const orphanageId = req.orphanageid;
    console.log('documentId:', documentId, 'type:', type, 'orphanageId:', orphanageId);

    if (!documentId || !type) return res.status(400).json({
        success: false,
        message: 'Invalid request'
    });

    try {
        const document = await prisma.child_document.findUnique({
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
        })

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        if (!orphanageId || document.child.orphanage.orphanageid !== orphanageId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const URL = await getSignedUrl(
            client,
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `child/document/${documentId}.${type}`,
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
                sender: true,
                receiver: true
            }
        });

        if (!request) return res.status(404).json({
            success: false,
            message: 'Child not found'
        });

        if ((request.sender !== userId) && (request.receiver !== userId)) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `request/${requestId}`, // Search for objects with this prefix
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

const getChildDocDownloadURL = async (req, res) => {
    const documentId = req.params.documentId;
    const orphanageId = req.orphanageid;

    console.log('documentId:', documentId);

    try {
        const document = await prisma.child_document.findUnique({
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

        const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: `child/document/${documentId}.pdf`, // Search for objects with this prefix
            MaxKeys: 1 // Limit the number of keys returned
        };

        const data = await s3.listObjectsV2(params).promise();
        console.log('data:', data.Contents);
        //if a photo is not in S3
        if (data.Contents.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Document not found'
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

<<<<<<< HEAD
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

const deleteFileInS3 = async (key) => {

    const bucketName = process.env.S3_BUCKET;

    await s3.deleteObject({
        Bucket: bucketName,
        Key: sourceKey
    }).promise();
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



module.exports = { getChildPhotoUploadURL, getChildDocUploadURL, moveFileInS3 };
module.exports = {
    moveFileInS3,
    copyFileInS3,
    getChildPhotoUploadURL,
    getChildDocUploadURL,
    getChildPhotoDownloadURL,
    getRequestPhotoDownloadURL,
    getChildDocDownloadURL,
    deleteFileInS3,
    uploadDocuments,
    getDocumentUrls
};