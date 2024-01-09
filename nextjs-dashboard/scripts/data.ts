import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

export async function fetchRevenue(){
    try {
        const allRevenue = await prisma.revenue.findMany()
        return allRevenue
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch all revenue.')
    }finally {
        await prisma.$disconnect()
    }
}

export async function fetchLatestInvoices() {
    try {
        const data= await prisma.invoice.findMany({
            orderBy: {
                date: 'desc',
            },
            take: 5,
            include: {
                customer: {
                    select: {
                        name: true,
                        imageUrl: true,
                        email: true,
                    },
                },
            },
        });
        console.log(data)

        const latestInvoices = data.map((invoice) => ({
            id: invoice.id,
            amount:formatCurrency(invoice.amount),
            date: invoice.date,
            customerId: invoice.customerId,
            name: invoice.customer.name,
            image_url: invoice.customer.imageUrl,
            email: invoice.customer.email,
            }))

        console.log(latestInvoices)
        return latestInvoices;
    } catch (error) {
        console.error('Prisma Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    } finally {
        // Disconnect from the Prisma Client to release the database connection
        await prisma.$disconnect();
    }
}

function formatCurrency(amount: number): string{
    // Implement your formatting logic here
    return amount.toFixed(2);
}
