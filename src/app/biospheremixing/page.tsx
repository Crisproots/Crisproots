'use client';
import dynamic from 'next/dynamic';

const BiosphereMixingIframe = dynamic(() => import('./BiosphereMixingIframe'), { ssr: false });

export default function BiosphereMixingPage() {
  return <BiosphereMixingIframe />;
} 