const { PrismaClient } = require('@prisma/client');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { uploadDocuments } = require('../../controllers/fileController');
const { client } = require('../../config/s3Client');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        cases: {
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('@aws-sdk/client-s3', () => ({
    PutObjectCommand: jest.fn(),
}));
jest.mock('../../config/s3Client', () => ({
    client: {
        send: jest.fn(),
    },
}));

describe('uploadDocuments', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            body: {
                caseId: 'case123',
            },
            files: {
                marriageCertificate: {
                    name: 'marriageCertificate.pdf',
                    data: Buffer.from('marriage certificate content'),
                    mimetype: 'application/pdf',
                },
                incomeCertificate: {
                    name: 'incomeCertificate.pdf',
                    data: Buffer.from('income certificate content'),
                    mimetype: 'application/pdf',
                },
                birthCertificate: {
                    name: 'birthCertificate.pdf',
                    data: Buffer.from('birth certificate content'),
                    mimetype: 'application/pdf',
                },
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 400 if no files are uploaded', async () => {
        req.files = null;
        await uploadDocuments(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'No files were uploaded.',
        });
    });

    it('should return 400 if not all required documents are provided', async () => {
        delete req.files.marriageCertificate;  // Simulate missing file
        await uploadDocuments(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'All documents must be provided.',
        });
    });

    it('should return 400 if caseId is missing', async () => {
        req.body.caseId = null;
        await uploadDocuments(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Case ID is required.',
        });
    });

    it('should upload all files and update the case in the database', async () => {
        client.send.mockResolvedValue({});
        prisma.cases.update.mockResolvedValue({
            caseid: 'case123',
            documents: {
                marriageCertificate: 'marriageCertificate.pdf',
                incomeCertificate: 'incomeCertificate.pdf',
                birthCertificate: 'birthCertificate.pdf',
            },
        });

        await uploadDocuments(req, res);

        expect(client.send).toHaveBeenCalledTimes(3);
        expect(client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
        expect(prisma.cases.update).toHaveBeenCalledWith({
            where: { caseid: 'case123' },
            data: {
                documents: {
                    marriageCertificate: 'marriageCertificate.pdf',
                    incomeCertificate: 'incomeCertificate.pdf',
                    birthCertificate: 'birthCertificate.pdf',
                },
            },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Files uploaded successfully!',
        });
    });

    it('should return 500 if there is an error during file upload', async () => {
        client.send.mockRejectedValue(new Error('S3 upload error'));

        await uploadDocuments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to upload documents',
        });
    });

    it('should return 500 if there is an error updating the database', async () => {
        client.send.mockResolvedValue({});
        prisma.cases.update.mockRejectedValue(new Error('Database error'));

        await uploadDocuments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to upload documents',
        });
    });
});
