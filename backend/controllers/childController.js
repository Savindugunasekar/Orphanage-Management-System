const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ROLES_LIST = require('../config/roles_list')
const { moveFileInS3, copyFileInS3, deleteFileInS3, renameFileInS3 } = require('./fileController');


const getChild = async (req, res) => {
    const childid = req.params.childid

    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            }
        })

        if (!child) return res.sendStatus(404);
        //check if user is authorized to view child
        if (!req.roles.includes(ROLES_LIST.Admin) && ((!req.orphanageid) || (child.orphanageid !== req.orphanageid))) return res.sendStatus(401);

        res.json({
            success: true,
            child: child
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching child.'
        });
    }

}

const getOrphanageChildren = async (req, res) => {
    try {
        const orphanageid = req.params.orphanageid;
        //check if user is authorized to view child
        if (!req.roles.includes(ROLES_LIST.Admin) && ((!req.orphanageid) || (req.orphanageid !== orphanageid))) return res.sendStatus(401);

        const childrenList = await prisma.child.findMany({
            where: {
                orphanageid: orphanageid
            },
            select: {
                childid: true,
                name: true,
                date_of_birth: true,
                gender: true
            }
        });
        res.json({
            success: true,
            childrenList: childrenList
        })

    } catch (error) {

        console.log('Database query failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching children.'
        });
    }
}

const addChild = async (req) => {
    //extracting data from request
    const { orphanageid } = req.body;
    //check if user is authorized to add child
    if ((!req.orphanageid) || (orphanageid !== req.orphanageid)) return 401

    try {//database call
        const newChild = await prisma.child.create({
            data: req.body
        })
        //sending response
        return {
            childid: newChild.childid,
            name: newChild.name,
            date_of_birth: newChild.date_of_birth,
            gender: newChild.gender
        }

    } catch (error) {
        console.log('Database query failed:', error);
        return 500
    }
}

const updateChild = async (req) => {
    const { childid, name, date_of_birth, gender, religion, nationality, medicaldetails, educationaldetails } = req.body;
    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            },
            select: { orphanageid: true }
        })

        if (!child) return 404;
        //check if user is authorized to update child
        if ((!req.orphanageid) || (child.orphanageid !== req.orphanageid)) return 401;

        await prisma.child.update({
            where: {
                childid: childid
            },
            data: {
                name: name,
                date_of_birth: new Date(date_of_birth),
                gender: gender,
                nationality: nationality,
                religion: religion,
                medicaldetails: medicaldetails,
                educationaldetails: educationaldetails
            }
        })
        return 200

    } catch (error) {
        console.error('Database query failed:', error);
        return 500
    }
}

const deleteChild = async (req) => {
    const childid = req.body.childid;
    try {
        const child = await prisma.child.findUnique({
            where: {
                childid: childid
            },
            select: { orphanageid: true }
        })

        if (!child) return 404;
        //check if user is authorized to delete child
        if ((!req.orphanageid) || (child.orphanageid !== req.orphanageid)) return 401;

        const documents = await prisma.child_document.findMany({
            where: {
                childid: childid
            }
        })

        for (let i = 0; i < documents.length; i++) {
            deleteFileInS3(`child/document/${documents[i].documentid}.pdf`);
        }

        const temp_documents = await prisma.child_document_temp.findMany({
            where: {
                childid: childid
            }
        })

        for (let i = 0; i < temp_documents.length; i++) {
            deleteFileInS3(`request/document/${temp_documents[i].documentid}.pdf`);
        }

        await prisma.child_document.deleteMany({
            where: {
                childid: childid
            }
        })

        await prisma.child.delete({
            where: {
                childid: childid
            }
        })
        return 200

    } catch (error) {
        console.error('Database query failed:', error);
        return 500
    }
}



module.exports = { getOrphanageChildren, addChild, getChild, updateChild, deleteChild }