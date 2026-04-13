"use client";

import Image from "next/image";
import { Heart, MessageSquare, Share2, Scissors, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function IdeaCard({ post }: { post: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="card p-0 overflow-hidden border-accent/10"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={post.images?.[0] || 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest uppercase">
                    {post.tags?.[0] || 'Modern'}
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {post.tailorId?.name?.[0] || 'A'}
                    </div>
                    <div>
                        <h4 className="text-xs font-bold font-playfair">{post.tailorId?.name || 'Artisan Tailor'}</h4>
                        <p className="text-[10px] text-muted">Creative Idea</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-playfair font-bold text-primary mb-1">{post.title}</h3>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">{post.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-accent/5">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-muted hover:text-error transition-all group">
                            <Heart size={16} className="group-hover:fill-error" />
                            <span className="text-[10px] font-bold">{post.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-all group">
                            <MessageSquare size={16} />
                            <span className="text-[10px] font-bold">12</span>
                        </button>
                    </div>
                    <button className="p-2 rounded-full bg-texture hover:bg-primary hover:text-white transition-all">
                        <Share2 size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
