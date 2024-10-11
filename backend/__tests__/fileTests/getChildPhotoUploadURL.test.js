const { PrismaClient } = require('@prisma/client');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getChildPhotoUploadURL } = require('../../controllers/fileController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        request: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(),
}));

describe('getChildPhotoUploadURL', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: {
                path: '123.jpg',
            },
            userId: 'sender123',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 400 if requestId or type is missing', async () => {
        req.params.path = 'invalidpath';
        await getChildPhotoUploadURL(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Invalid request',
        });
    });

    it('should return 404 if the request is not found', async () => {
        prisma.request.findUnique.mockResolvedValue(null);
        await getChildPhotoUploadURL(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Request not found',
        });
    });

    it('should return 401 if the user is unauthorized', async () => {
        prisma.request.findUnique.mockResolvedValue({ sender_id: 'otherUser' });
        await getChildPhotoUploadURL(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized',
        });
    });

    it('should return the signed URL if request is valid and user is authorized', async () => {
        prisma.request.findUnique.mockResolvedValue({ sender_id: 'sender123' });
        getSignedUrl.mockResolvedValue('http://signed-url.com');

        await getChildPhotoUploadURL(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            URL: 'http://signed-url.com',
        });
        expect(getSignedUrl).toHaveBeenCalledWith(
            expect.anything(),  // S3 client instance
            expect.any(PutObjectCommand),  // Command object
            { expiresIn: 1000 * 60 }
        );
    });

    it('should return 500 if there is an error generating the signed URL', async () => {
        prisma.request.findUnique.mockResolvedValue({ sender_id: 'sender123' });
        getSignedUrl.mockRejectedValue(new Error('Failed to get upload URL'));

        await getChildPhotoUploadURL(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to get upload URL',
        });
    });
});
