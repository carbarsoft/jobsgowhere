import * as React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { throttle } from "throttle-debounce";

import LogoImg from "../../logo.svg";
import { SCREENS } from "../../media";
import MobileNav from "./MobileNav";
import NavToggle from "./NavToggle";
import NavBack from "./NavBack";
import UserNav from "./UserNav";

const Container = styled.div`
  grid-area: header;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  position: relative;
  z-index: 2;

  ${SCREENS.Up.Desktop} {
    position: relative;
    padding: 0 2.625rem;
  }

  ${SCREENS.Down.Tablet} {
    height: var(--mobile-header-height);
    width: 100%;

    &.fixed {
      position: fixed;
      transition: transform 200ms ease-in-out;
    }

    &.hide {
      transform: translateY(-100%);
    }

    &.show {
      transform: translateY(0);
    }
  }
`;

const Logo = styled.div`
  img {
    height: 2.3125rem;
  }
  ${SCREENS.Up.Desktop} {
    padding-left: 2.625rem;
    img {
      height: auto;
    }
  }
`;

const Nav = styled.nav`
  margin-left: auto;
  ul {
    margin: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    list-style: none;
  }
  li + li {
    margin-left: 1rem;
  }

  ${SCREENS.Down.Tablet} {
    display: none;
  }
`;

const Header: React.FC = function () {
  const [mobileNavActive, setMobileNavActive] = React.useState(false);
  const toggleNav = function () {
    setMobileNavActive(!mobileNavActive);
  };
  const scrollRef = React.useRef(0);
  const [fixed, setFixed] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const match = useRouteMatch<{ postId: string }>("/(jobs|talents)/:postId");
  const isDetailScreen = Boolean(match?.params?.postId);

  function handleScroll() {
    const { scrollY } = window;

    setHidden(scrollY >= 56 && scrollY > scrollRef.current);

    // Forces repaint when [hidden] is changed and header is not fixed prior
    // This is to prevent unwanted transition when [hidden] and [fixed] are set to true in the same render
    if (!fixed) {
      const _ = window.scrollY;
    }

    if (scrollY > 102) setFixed(true);
    if (scrollY === 0) setFixed(false);

    scrollRef.current = scrollY;
  }

  React.useEffect(() => {
    window.addEventListener("scroll", throttle(200, handleScroll));
  }, []);

  React.useEffect(() => {
    window.document.body.classList.toggle("mobile-scroll-lock", mobileNavActive);
  }, [mobileNavActive]);
  return (
    <>
      <Container
        className={`${fixed ? "fixed" : ""} ${
          isDetailScreen ? "fixed show" : hidden ? "hide" : "show"
        }`}
      >
        {isDetailScreen ? (
          <NavBack />
        ) : (
          <NavToggle onClick={toggleNav} active={mobileNavActive}>
            <i />
            <i />
            <i />
          </NavToggle>
        )}

        <Logo>
          <Link to="/">
            <img alt="JobsGoWHere" src={LogoImg} />
          </Link>
        </Logo>
        <Nav>
          <UserNav />
        </Nav>
      </Container>
      <MobileNav active={mobileNavActive} />
    </>
  );
};

export default Header;
