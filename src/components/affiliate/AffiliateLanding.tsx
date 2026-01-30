"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
    ChevronDown,
    Check,
    Users,
    Share2,
    DollarSign,
    Sparkles,
    HeadphonesIcon,
    Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AffiliateFaq, AffiliateOfMonth } from "@/types";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
};

const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } },
};

export function AffiliateLanding() {
    const [faqs, setFaqs] = useState<AffiliateFaq[]>([]);
    const [bestAffiliates, setBestAffiliates] = useState<AffiliateOfMonth[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await apiClient("/affiliate/landing");
                if (res.success) {
                    setFaqs(res.data.faqs || []);
                    setBestAffiliates(res.data.bestAffiliates || []);
                }
            } catch {
                // fail silently
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-[#8C0000] animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="container-custom">
                {/* Hero Section */}
                <section className="pt-28 lg:pt-40 lg:pb-16">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-center"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            custom={0}
                            className="mb-6 text-4xl font-semibold text-black sm:text-5xl 2xl:text-7xl 2xl:font-bold"
                        >
                            Become An{" "}
                            <span className="text-[#8C0000]">Affiliate</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            custom={1}
                            className="mx-auto mb-8 max-w-3xl text-base text-black md:text-xl"
                        >
                            Turn your influence into income by promoting
                            PrinceWill&apos;s world-class online courses,
                            building training courses for automation, quality
                            work and convenience. Join our affiliate program and
                            start earning commissions by sharing high-quality
                            referring shoppers to our store.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            custom={2}
                            className="mx-auto mb-8 flex max-w-3xl items-center justify-center gap-4 rounded-2xl border p-3 shadow-md lg:p-4"
                        >
                            <div className="w-fit">
                                <p className="m-0 p-0 text-2xl font-bold text-[#8C0000] md:text-4xl 2xl:text-6xl">
                                    5%
                                </p>
                                <p className="m-0 p-0 text-sm text-[#8C0000]">
                                    Commission
                                </p>
                            </div>
                            <div className="text-sm font-semibold text-black md:text-lg 2xl:text-xl">
                                On every new successful purchase you refer
                            </div>
                            <Link
                                href="/affiliate/register"
                                className="rounded-lg bg-[#8C0000] px-4 py-1.5 font-semibold text-white transition-colors hover:bg-[#6B0000] lg:px-7 lg:py-2"
                            >
                                Join Now
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Affiliates of the Month */}
                {bestAffiliates.length > 0 && (
                    <section className="py-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="mb-12 text-center text-3xl font-bold 2xl:text-4xl">
                                Affiliates of the Month
                            </h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {bestAffiliates.map((affiliate, i) => (
                                    <motion.div
                                        key={affiliate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.1,
                                            duration: 0.5,
                                        }}
                                        className="overflow-hidden rounded-t-[50px] group"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={affiliate.image || "/images/placeholder.png"}
                                                alt={affiliate.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="bg-transparent px-2 py-6">
                                            <h3 className="mb-2 text-lg font-bold">
                                                {affiliate.name}
                                            </h3>
                                            <p className="text-sm text-black">
                                                {affiliate.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* How It Works */}
                <section className="bg-white pb-12 lg:py-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            How It Works
                        </h2>
                        <div className="w-full px-4 md:py-12">
                            {/* Step Indicators */}
                            <div className="relative mx-auto mb-10 flex max-w-4xl items-center justify-between">
                                <div className="absolute left-0 top-1/2 z-0 h-1 w-full -translate-y-1/2 bg-[#8C0000]" />
                                {[1, 2, 3].map((step, i) => (
                                    <motion.div
                                        key={step}
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.2,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                        className="relative z-10 flex flex-col items-center"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8C0000] text-xl font-bold text-white md:h-16 md:w-16">
                                            {step}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Step Descriptions */}
                            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                                {[
                                    {
                                        icon: Users,
                                        title: "Sign up for free",
                                        desc: "Join the program in a few simple clicks and receive your unique referral link.",
                                    },
                                    {
                                        icon: Share2,
                                        title: "Share and promote",
                                        desc: "Leverage your network to share your link through social media, email, blogs, or websites.",
                                    },
                                    {
                                        icon: DollarSign,
                                        title: "Earn commission",
                                        desc: "When someone buys a product through your link, you get paid.",
                                    },
                                ].map((step, i) => (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 }}
                                        className="mx-auto w-full xl:w-[65%]"
                                    >
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#8C0000]/10">
                                            <step.icon className="h-6 w-6 text-[#8C0000]" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-black">
                                            {step.title}
                                        </h3>
                                        <p className="text-base text-black">
                                            {step.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Exclusive Perks */}
                <section className="py-10">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8 max-lg:order-1"
                        >
                            <h2 className="mb-12 text-2xl font-bold max-lg:text-center md:text-3xl">
                                Exclusive perks for Affiliates
                            </h2>
                            {[
                                {
                                    icon: Sparkles,
                                    title: "Exclusive Discount",
                                    desc: "Get access to banners, logos, and pre-written content to make it easy to promote your marketing efforts.",
                                },
                                {
                                    icon: HeadphonesIcon,
                                    title: "Dedicated Affiliate Support",
                                    desc: "Get 24/7 comprehensive support team that's focused on helping you succeed.",
                                },
                            ].map((perk, i) => (
                                <div
                                    key={perk.title}
                                    className="flex items-start gap-4"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8C0000]">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-lg font-bold">
                                            {perk.title}
                                        </h3>
                                        <p className="font-semibold text-black">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Link
                                href="/affiliate/register"
                                className="inline-block rounded-lg bg-[#8C0000] px-8 py-2 font-semibold text-white transition-colors hover:bg-[#6B0000]"
                            >
                                Join Now
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <Image
                                src="/images/marketing.png"
                                alt="Affiliate Dashboard"
                                width={600}
                                height={400}
                                className="w-full"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Who Should Join */}
                <section className="bg-white py-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-12 text-3xl font-bold 2xl:text-4xl">
                            Who should join?
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                "Freelance Influencers",
                                "Instagrams & TikTok Creators",
                                "Anyone With An Audience",
                                "Blog Bloggers & Content Creators",
                                "YouTubers on Fashion & Lifestyle",
                                "Small Local Business & People",
                            ].map((who, i) => (
                                <motion.div
                                    key={who}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#8C0000]">
                                        <Check className="h-2 w-2 text-white" />
                                    </div>
                                    <span className="font-bold text-black">
                                        {who}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* FAQ Section */}
                {faqs.length > 0 && (
                    <section className="pb-18 md:py-16">
                        <div className="mx-auto max-w-4xl">
                            <div className="mx-auto mb-12 max-w-2xl">
                                <div className="rounded-xl border-4 border-white bg-[#8C0000] px-8 py-5 text-center text-xl font-semibold text-white shadow-md md:text-4xl 2xl:text-5xl">
                                    Affiliate Program FAQ
                                </div>
                            </div>

                            <div className="mx-auto max-w-lg space-y-3">
                                {faqs.map((faq, index) => (
                                    <div key={faq.id}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaq(
                                                    openFaq === faq.id
                                                        ? null
                                                        : faq.id
                                                )
                                            }
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-3xl p-5 text-left text-sm font-medium text-white transition md:text-base ${
                                                openFaq === faq.id
                                                    ? "bg-[#700000]"
                                                    : "bg-[#2E2E2E] hover:bg-[#700000]"
                                            }`}
                                        >
                                            <div className="flex gap-2">
                                                <span>{index + 1}.</span>
                                                <span>{faq.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                                                    openFaq === faq.id
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {openFaq === faq.id && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="border-t border-gray-200 bg-white p-5 text-gray-800">
                                                        {typeof faq.content === "string"
                                                            ? faq.content
                                                            : JSON.stringify(faq.content)}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
