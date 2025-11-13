export interface EventItem {
  title: string;
  image: string; // path under /public, e.g. '/images/event1.png'
  slug: string;
  location: string;
  date: string; // human-friendly date or range
  time: string; // human-friendly time or start time
}

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "Mar 10–12, 2026",
    time: "09:00",
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event2.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA, USA",
    date: "Apr 22–23, 2026",
    time: "10:00",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event1.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "Jun 5–7, 2026",
    time: "09:30",
  },
  {
    title: "HackMIT 2026",
    image: "/images/event2.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "Jan 18–20, 2026",
    time: "18:00",
  },
  {
    title: "DevOpsDays New York 2026",
    image: "/images/event1.png",
    slug: "devopsdays-ny-2026",
    location: "New York, NY, USA",
    date: "May 15, 2026",
    time: "09:00",
  },
  {
    title: "VueConf Paris 2026",
    image: "/images/event2.png",
    slug: "vueconf-paris-2026",
    location: "Paris, France",
    date: "Sep 12–13, 2026",
    time: "10:00",
  },
];

export default events;
