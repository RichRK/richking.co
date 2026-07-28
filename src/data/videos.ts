/**
 * The six films, in the order the 2014 video page listed them.
 *
 * The old site kept this data in three places at once: the markup carried the
 * title and duration, styles.css mapped each one to a poster via an
 * `a[href*="…"]` background rule, and ~270 lines of inline script wired up a
 * YouTube IFrame API player per video. It is one array now.
 *
 * The films also exist on Vimeo — that is what the mobile site linked to — but
 * the YouTube embeds carry the higher-quality versions, so those win.
 */
export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  poster: string;
  description: string;
  maxQuality: string;
}

export const videos: Video[] = [
  {
    id: 'casa-de-lis',
    title: 'Casa de Lis',
    youtubeId: 'RWRFZfts7vw',
    duration: '01:33',
    poster: '/images/video5.jpg',
    description:
      'Right at the heart of Turrialba, Costa Rica, Casa de Lis feels more like stepping into someone’s home than a hostel. Capturing the enormous effort put into decorating the place was a privilege.',
    maxQuality: '1080p',
  },
  {
    id: 'raleigh-kit-list',
    title: 'Raleigh Kit List',
    youtubeId: 'BFqJPkb9GNk',
    duration: '10:09',
    poster: '/images/video3.jpg',
    description:
      'Produced for Raleigh Costa Rica & Nicaragua. This covers all the equipment and clothing that volunteer managers are advised to bring to see them through 13 weeks of volunteering.',
    maxQuality: '1080p',
  },
  {
    id: 'corcovado-trek',
    title: 'Corcovado Trek',
    youtubeId: '6pbVUlh6Tss',
    duration: '00:42',
    poster: '/images/video2.jpg',
    description:
      'This short interview with Ana Solórzano is one of a series documenting the experiences and thoughts of Raleigh volunteers during their 15 days on project.',
    maxQuality: '1080p',
  },
  {
    id: 'hotel-casa-cambranes',
    title: 'Hotel Casa Cambranes',
    youtubeId: 'cikUPNKNRGQ',
    duration: '01:04',
    poster: '/images/video6.jpg',
    description:
      'Casa Cambranes was a pleasure to shoot. Located in the capital of Costa Rica, San José, their 12 unique, individually decorated rooms made for a great central theme.',
    maxQuality: '1080p',
  },
  {
    id: 'a-raleigh-roadtrip',
    title: 'A Raleigh Roadtrip',
    youtubeId: 'hCO5bv1WKsE',
    duration: '02:01',
    poster: '/images/video4.jpg',
    description:
      'A short video documenting one of the many roadtrips made on every Raleigh International expedition. To the volunteers of each project, each Jeep is a much-awaited link back to the outside world.',
    maxQuality: '720p',
  },
  {
    id: 'turrisantos-trek',
    title: 'Turrisantos Trek',
    youtubeId: '77UcGrJjlPE',
    duration: '01:00',
    poster: '/images/video1.jpg',
    description:
      'This short interview with John Wan is one of a series documenting the experiences and thoughts of Raleigh volunteers during their 15 days on project.',
    maxQuality: '1080p',
  },
];
