'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Registered once; every client component imports from here.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const NO_REDUCED_MOTION = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 821px)';
