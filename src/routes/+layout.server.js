import { parse } from 'yaml';
import cv from '$lib/data/cv.yml?raw';
import research from '$lib/data/research.yml?raw';
import projects from '$lib/data/projects.yml?raw';
import publications from '$lib/data/publications.yml?raw';

export const prerender = true;

export function load() {
  const updated = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
  return {
    cv: parse(cv),
    research: parse(research),
    projects: parse(projects),
    publications: parse(publications),
    updated
  };
}
