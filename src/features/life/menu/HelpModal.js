import React from 'react';

import { IoMdHelpCircle } from 'react-icons/io';
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';

import {
  Box,
  Collapse,
  IconButton,
  Flex,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Link,
} from '@chakra-ui/core';

const ExternalLink = ({ text, href }) => {
  return (
    <Link
      href={href}
      isExternal
      fontWeight="500"
      textDecor="underline"
      _hover={{ textDecoration: 'none' }}
    >
      {text}
    </Link>
  );
};

const Oblique = ({ children, text }) => (
  <span style={{ fontStyle: 'oblique' }}>{children || text}</span>
);

const Collapsible = ({ label, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Flex
      onClick={() => setIsOpen((isOpen) => !isOpen)}
      direction="column"
      px="1rem"
      mt="1rem"
      borderWidth="1px"
      rounded="sm"
    >
      <Flex
        justify="space-between"
        alignItems="center"
        py="0.5rem"
        style={{ cursor: 'pointer' }}
      >
        <Text fontWeight="600">{label}</Text>
        <Box as={isOpen ? FaAngleDoubleUp : FaAngleDoubleDown} />
      </Flex>
      <Collapse isOpen={isOpen} pb="0.5rem">
        {children}
      </Collapse>
    </Flex>
  );
};

const keyboardShortcuts = [
  { shortcut: 'spacebar', description: 'run/stop the automaton' },
  { shortcut: '->', description: 'tick automaton once' },
  { shortcut: 'c', description: 'clear all cells' },
  { shortcut: 'r', description: 'randomize all cells' },
  {
    shortcut: 'f',
    description: 'fit cells to window',
  },
  { shortcut: '↑|↓', description: 'speed up/down' },
  { shortcut: '4', description: 'set neighborhood to von neumann' },
  { shortcut: '6', description: 'set neighborhood to hexagonal' },
  { shortcut: '8', description: 'set neighborhood to moore' },
  {
    shortcut: 'w',
    description: 'toggle edge wrapping',
  },
  { shortcut: 'g', description: 'toggle gridlines' },
  { shortcut: 's', description: 'toggle stats' },
];

export const HelpModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        icon={IoMdHelpCircle}
        fontSize="1.5rem"
        p={0}
        h="unset"
        minW="unset"
        mr="0.5rem"
        variant="unstyled"
        aria-label="help"
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="42rem"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="300">about</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="sm">
            <Text>
              <Oblique text="lifelike" /> is a cellular automaton toy that can
              model the late John Conway's famous{' '}
              <ExternalLink
                href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
                text="Game of Life"
              />
              , as well as any{' '}
              <ExternalLink
                href="https://en.wikipedia.org/wiki/Life-like_cellular_automaton"
                text='"Life-like"'
              />{' '}
              cellular automaton.
            </Text>
            <br />
            <Text>
              this app is built using React and Chakra UI. the grid is rendered
              using canvas. check out the code on{' '}
              <ExternalLink
                href="https://github.com/psychedelicious/lifelike"
                text="Github"
              />
              .
            </Text>

            {/* <Collapsible
              label={
                <span>
                  using <Oblique text="lifelike" />
                </span>
              }
            >
              todo
            </Collapsible> */}

            <Collapsible label="a brief intro to Life-like cellular automata">
              <Text>
                in a Life-like CA, a 2D grid is populated by cells with two
                possible states (alive or dead). during each iteration or tick,
                each cell's next state is a function of the number of its living
                neighbors.
              </Text>
              <br />
              <Text>
                a cell's neighbors include the 8 cells immediately surround it -
                the{' '}
                <ExternalLink
                  href="https://en.wikipedia.org/wiki/Moore_neighborhood"
                  text='"Moore"'
                />{' '}
                neighborhood. other neighborhoods are possible, like the 4-cell{' '}
                <ExternalLink
                  href="https://en.wikipedia.org/wiki/Von_Neumann_neighborhood"
                  text='"von Neumann"'
                />{' '}
                neighborhood.
              </Text>
              <br />
              <Text>
                the classic Game of Life determines the next state using this
                rule:
              </Text>
              <List styleType="square" pl="1rem">
                <ListItem>
                  if a dead cell has exactly 3 living neighbors, it will be{' '}
                  <Oblique>born</Oblique>.
                </ListItem>
                <ListItem>
                  if a living cell has 2 or 3 living neighbors, it will{' '}
                  <Oblique>survive</Oblique>.
                </ListItem>
                <ListItem>
                  else, the state of the cell will not change.
                </ListItem>
              </List>
              <br />
              <Text>
                we can describe this rule using a shorthand format - B3/S23
                (born3/survive23). any number of neighbors is valid for the born
                and survive sub-rules, from 0 to the maximum possible neighbor
                count.
              </Text>
            </Collapsible>

            <Collapsible label="keyboard shortcuts">
              {keyboardShortcuts.map((k, i) => {
                return (
                  <Flex direction="row" key={`shortcut${i}`}>
                    <Text w="6rem" textAlign="right" mr=".5rem">
                      [{k.shortcut}]
                    </Text>
                    <Text>~> {k.description}</Text>
                  </Flex>
                );
              })}
            </Collapsible>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
