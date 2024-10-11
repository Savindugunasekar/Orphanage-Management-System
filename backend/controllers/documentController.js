const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ROLES_LIST = require('../config/roles_list')

const getChildDocuments = async (req, res) => {

    const childId = req.params.childId

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childId
            }
        })

        if (!child) return res.status(404).json({ success: false, message: 'Child not found' });
        //check if user is authorized to view child
        if ((!req.orphanageid) || (child.orphanageid !== req.orphanageid)) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const documents = await prisma.child_document.findMany({
            where: {
                childid: childId
            }
        })

        res.json({
            success: true,
            documents: documents
        })

    } catch (error) {

        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });

    }

}

const getChildDocument = async (req, res) => {

    const documentId = req.params.documentId

    try {
        const document = await prisma.child_document.findUnique({
            where: {
                documentid: documentId
            },
            include: {
                child: {
                    select: {
                        orphanageid: true
                    }
                }
            }
        })

        //check if user is authorized to view child
        if ((!req.orphanageid) || (document.child.orphanageid !== req.orphanageid)) return res.status(401).json({ success: false, message: 'Unauthorized' });

        res.json({
            success: true,
            document: {
                documentid: document.documentid,
                childid: document.childid,
                document_name: document.document_name,
                document_type: document.document_type,
                status: document.status,
                created_at: document.created_at
            }
        })

    } catch (error) {

        console.error('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred'
        });

    }

}

module.exports = { getChildDocuments, getChildDocument }