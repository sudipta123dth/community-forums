"use client";

import DrawerProps from "@/interface/props/drawerprops";
import { CustomProvider, Drawer } from "rsuite";

export default function DrawerComponent(props: DrawerProps) {
  return (
    <CustomProvider theme={"light"}>
      <Drawer
        open={props.open}
        onClose={props.onClose}
        // backdrop={props.backdrop !== undefined ? props.backdrop : "static"}
        keyboard={props.closeOnEsc}
        size={props.size}
        placement={props.placement}
        style={props.style}
        className={props.className}
      >
        <Drawer.Header className={props.headerClassName}>
          <Drawer.Title>{props.title}</Drawer.Title>
          {props.action && <Drawer.Actions>{props.action}</Drawer.Actions>}
        </Drawer.Header>
        <Drawer.Body className={props.bodyClassName}>
          {props.children}
        </Drawer.Body>
      </Drawer>
    </CustomProvider>
  );
}
