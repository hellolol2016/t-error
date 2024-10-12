import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";
import Icon from "./logo.png";

const LinkStyled = styled(Link)(() => ({
    height: "70px",
    width: "180px",
    overflow: "hidden",
    display: "block",
}));

const Logo = () => {
    return (
        <LinkStyled href="/">
            <Image
                src={Icon}
                alt="logo"
                height={70}
                width={174}
                priority
            />
        </LinkStyled>
    );
};

export default Logo;