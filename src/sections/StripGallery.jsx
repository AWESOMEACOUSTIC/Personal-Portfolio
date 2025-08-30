import React from "react";
import ExpandingStripGallery from "../components/ExpandingStripGallery";

import image1 from "../assets/071cf11a7f7e7a3d65b4068e02460f1f.jpg";
import image2 from "../assets/landscape-2.jpg";
import image3 from "../assets/landscape-3.jpg";
import image4 from "../assets/landscape-4.jpg";
import image5 from "../assets/landscape-5.jpg";
import image6 from "../assets/landscape-6.jpg";
import image7 from "../assets/70c7446d478bb613532140d0e1250895.jpg";


const IMAGES = [
  { src: image1, alt: "Gallery image 1" },
  { src: image2, alt: "Gallery image 2" },
  { src: image3, alt: "Gallery image 3" },
  { src: image4, alt: "Gallery image 4" },
  { src: image5, alt: "Gallery image 5" },
  { src: image6, alt: "Gallery image 6" },
  { src: image7, alt: "Gallery image 7" },
];

export default function StripGallery() {
  return (
    <main className="min-h-screen text-neutral-100">
      <section className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-600 tracking-tight pt-10 pb-4">
          Expanding Strip Gallery
        </h1>
        <p className="text-neutral-400 font-semibold pb-6">
          Hover a strip to expand. Move across to switch. Move out to contract.
        </p>

        <ExpandingStripGallery
          images={IMAGES}
          collapsedPx={26}     // slit width
          expandedPx={520}     // expanded width
          heightPx={420}       // gallery height
          gapPx={14}           // spacing between strips
          dimOthers={0.22}     // darkness on non-active strips
          activationDelay={100} // ms delay to reduce flicker when skimming
        />
      </section>
    </main>
  );
}
