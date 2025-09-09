import * as React from "react";
import CardStackStarter from "../components/CardStackStarter";

export default function CardStack() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 p-8">
      <CardStackStarter
        images={[
          // If your dev server blocks external images, replace with local /public images
          "/images/shot-1.jpg",
          "/images/shot-2.jpg",
          "/images/shot-3.jpg",
          "/images/shot-4.jpg",
        ]}
        className="h-[500px] w-full max-w-2xl"
        cardWidth={720}
        aspect="16 / 10"
      />
    </div>
  );
}() => {
  return (
    <div className="grid place-items-center bg-gray-100 p-8">
      <CardStackStarter
        images={[
          "https://placekitten.com/600/400",
          "https://placebear.com/600/400",
          "https://placehold.co/600x400",
          "https://picsum.photos/id/237/600/400",
        ]}
        className="h-[100%] w-full max-w-lg"
      />
    </div>
  );
}