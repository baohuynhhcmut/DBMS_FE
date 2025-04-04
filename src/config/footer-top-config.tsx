import {  IoCarOutline } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import { IoShirtOutline } from "react-icons/io5";



export const footerConfig = [
    {
      name: "Free shipping",
      imageSrc:
        <IoCarOutline />,
      description:
        "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
    },
    {
      name: "10-year warranty",
      imageSrc:
        <LuBadgeCheck />,
      description:
        "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
    },
    {
      name: "Exchanges",
      imageSrc:
        <IoShirtOutline />,
      description:
        "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
    },
];

