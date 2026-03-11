import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.siteSettings.deleteMany()
    await prisma.donationTier.deleteMany()
    await prisma.stat.deleteMany()

    console.log('Cleared existing data.')

    // Create global settings
    await prisma.siteSettings.create({
        data: {
            id: 1,
            raised: 0,
            goal: 100000000,
            heroSubtitle: "A STORY OF FAITH IN KENTUCKY",
            heroTitle: "BUILD THE ARK",
            heroText: "Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.",
        }
    })

    console.log('Created site settings.')

    // Create tiers
    await prisma.donationTier.createMany({
        data: [
            {
                icon: "🍂",
                name: "Leaves",
                price: 25,
                available: 1000,
                description: "Loyalty for youth! Every great structure begins with a simple piece of wood.",
                features: JSON.stringify([
                    "Certificate of contribution",
                    "Monthly prayer updates",
                    "Stand by your window"
                ]),
                isPopular: false
            },
            {
                icon: "⚓",
                name: "Anchor",
                price: 75,
                available: 500,
                description: "Heavy stones that hold the structure together—your gift carries real weight.",
                features: JSON.stringify([
                    "Everything in Leaves",
                    "Personalized thank you letter",
                    "Digital updates monthly"
                ]),
                isPopular: false
            },
            {
                icon: "🏠",
                name: "House",
                price: 150,
                available: 250,
                description: "Upgrade from a mere frame to full-on foundation! Every family has a safe haven built.",
                features: JSON.stringify([
                    "Everything in Anchor",
                    "Your name on the Wall of the Ark",
                    "Guided video tour of your pieces",
                    "Priority event invitations"
                ]),
                isPopular: true
            },
            {
                icon: "🌿",
                name: "Branches",
                price: 500,
                available: 100,
                description: "Master the very craft of the Ark setup. Take all control of an entire structure.",
                features: JSON.stringify([
                    "Everything in House",
                    "VIP annual event plus on-site talk",
                    "Annual call from leadership",
                    "Annual recognition dinner"
                ]),
                isPopular: false
            }
        ]
    })

    console.log('Created donation tiers.')

    // Create stats
    await prisma.stat.createMany({
        data: [
            { value: "—", label: "FAMILIES TOUCHED", order: 1 },
            { value: "—", label: "MEALS PROVIDED", order: 2 },
            { value: "5K+", label: "LIVES IMPACTED", order: 3 },
            { value: "∞", label: "ETERNAL REWARD", order: 4 },
        ]
    })

    console.log('Created stats.')

    // Create Admin User
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.upsert({
        where: { email: 'admin@ark.com' },
        update: {},
        create: {
            email: 'admin@ark.com',
            password: hashedPassword
        }
    })

    console.log('Created admin user: admin@ark.com / admin123')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
