import {
  Box,
  Center,
  Grid,
  GridItem,
  Motion,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

export type HexesProps = { hexes: string[] }

export const Hexes: FC<HexesProps> = ({ hexes }) => {
  const count = hexes.length

  return (
    <>
      <Grid
        as="section"
        templateColumns={{ base: `repeat(${count}, 1fr)`, md: "1fr" }}
        gap={{ base: "0", md: "md" }}
      >
        {hexes.map((hex, index) => (
          <GridItem
            key={`${hex}-${index}`}
            as={VStack}
            minW="0"
            gap={{ base: "md", md: "sm" }}
          >
            <Box
              as={Link}
              href={`/colors/${hex.replace("#", "")}`}
              w="full"
              minH={{ base: "xs", md: "20", sm: "16" }}
              outline={0}
              position="relative"
              _focusVisible={{
                zIndex: 1,
                _before: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxShadow: "outline",
                  roundedLeft: { base: !index ? "2xl" : "0px", md: "2xl" },
                  roundedRight: {
                    base: index + 1 === count ? "2xl" : "0px",
                    md: "2xl",
                  },
                },
              }}
            >
              <Motion
                display={{ base: "block", md: "none" }}
                bg={hex}
                boxSize="full"
                initial={{
                  borderStartStartRadius: !index ? "16px" : "0px",
                  borderEndStartRadius: !index ? "16px" : "0px",
                  borderStartEndRadius: index + 1 === count ? "16px" : "0px",
                  borderEndEndRadius: index + 1 === count ? "16px" : "0px",
                }}
                whileHover={{ scale: 1.1, borderRadius: "16px" }}
              />

              <Motion
                display={{ base: "none", md: "block" }}
                bg={hex}
                boxSize="full"
                rounded="2xl"
                whileHover={{ scale: 0.95 }}
              />
            </Box>

            <Center px="xs">
              <Text as="span" color="muted" fontSize="sm" lineClamp={1}>
                {hex}
              </Text>
            </Center>
          </GridItem>
        ))}
      </Grid>
    </>
  )
}
