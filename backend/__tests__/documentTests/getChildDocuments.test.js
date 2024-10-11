const { PrismaClient } = require('@prisma/client');
const { getChildDocuments, getChildDocument } = require('../../controllers/documentController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        child: {
            findUnique: jest.fn(),
        },
        child_document: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getChildDocuments', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: { childId: 'child123' },
            orphanageid: 'orphanage123', // authorized orphanage
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 404 if the child is not found', async () => {
        prisma.child.findUnique.mockResolvedValue(null); // Simulate child not found

        await getChildDocuments(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Child not found',
        });
    });

    it('should return 401 if the user is unauthorized to view child', async () => {
        prisma.child.findUnique.mockResolvedValue({
            childid: 'child123',
            orphanageid: 'differentOrphanage', // Simulate unauthorized orphanage
        });

        await getChildDocuments(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized',
        });
    });

    it('should return 200 with documents if the user is authorized', async () => {
        prisma.child.findUnique.mockResolvedValue({
            childid: 'child123',
            orphanageid: 'orphanage123', // Authorized orphanage
        });

        prisma.child_document.findMany.mockResolvedValue([
            { documentid: 'doc1', document_name: 'doc1.pdf' },
            { documentid: 'doc2', document_name: 'doc2.pdf' },
        ]); // Simulate documents found

        await getChildDocuments(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            documents: [
                { documentid: 'doc1', document_name: 'doc1.pdf' },
                { documentid: 'doc2', document_name: 'doc2.pdf' },
            ],
        });
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.child.findUnique.mockRejectedValue(new Error('DB error')); // Simulate DB failure

        await getChildDocuments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred',
        });
    });
});

describe('getChildDocument', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: { documentId: 'document123' },
            orphanageid: 'orphanage123', // authorized orphanage
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 401 if the user is unauthorized to view the document', async () => {
        prisma.child_document.findUnique.mockResolvedValue({
            documentid: 'document123',
            child: { orphanageid: 'differentOrphanage' }, // Unauthorized orphanage
        });

        await getChildDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized',
        });
    });

    it('should return 200 with document details if the user is authorized', async () => {
        prisma.child_document.findUnique.mockResolvedValue({
            documentid: 'document123',
            childid: 'child123',
            document_name: 'document.pdf',
            document_type: 'PDF',
            status: 'uploaded',
            created_at: new Date('2023-01-01T00:00:00Z'),
            child: { orphanageid: 'orphanage123' }, // Authorized orphanage
        });

        await getChildDocument(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            document: {
                documentid: 'document123',
                childid: 'child123',
                document_name: 'document.pdf',
                document_type: 'PDF',
                status: 'uploaded',
                created_at: new Date('2023-01-01T00:00:00Z'),
            },
        });
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.child_document.findUnique.mockRejectedValue(new Error('DB error')); // Simulate DB failure

        await getChildDocument(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred',
        });
    });
});
