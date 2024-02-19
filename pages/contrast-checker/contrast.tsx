import type { CenterProps, ColorMode } from "@yamada-ui/react"
import {
  Center,
  ColorPicker,
  Grid,
  IconButton,
  Spacer,
  Text,
  VStack,
  Wrap,
  useTheme,
  useUpdateEffect,
  getMemoizedObject as get,
  GridItem,
  Tag,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState, type FC } from "react"
import { Fail, Pass, Refresh } from "components/media-and-icons"
import { useI18n } from "contexts/i18n-context"
import { isLight } from "utils/color"

export type ContrastProps = {
  mode: ColorMode
  fg: string
  bg: string
  score: number
  aa: {
    small: boolean
    large: boolean
    component: boolean
  }
  aaa: {
    small: boolean
    large: boolean
    component: boolean
  }
  level: { aa: boolean; aaa: boolean }
  queries: URLSearchParams
}

export const Contrast: FC<ContrastProps> = ({
  mode,
  fg,
  bg,
  score,
  aa,
  aaa,
  level,
  queries,
}) => {
  const { t } = useI18n()

  return (
    <VStack as="section" gap={{ base: "normal", sm: "md" }}>
      <Wrap gap="md">
        <ColorInput
          label={t("contrast-checker.foreground")}
          value={fg}
          mode={mode}
          queries={queries}
        />
        <ColorInput
          label={t("contrast-checker.background")}
          value={bg}
          mode={mode}
          queries={queries}
        />
      </Wrap>

      <VStack
        gap="0"
        rounded="2xl"
        overflow="hidden"
        position="relative"
        boxShadow={[
          "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px 1px rgba(0, 0, 0, 0.06)",
          "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px -5px 10px rgba(0, 0, 0, 0.2)",
        ]}
      >
        <SwitchButton mode={mode} fg={fg} bg={bg} queries={queries} />
        <ContrastPreview fg={fg} bg={bg} />
        <ContrastScore score={score} aa={aa} aaa={aaa} level={level} />
      </VStack>
    </VStack>
  )
}

type ColorInputProps = Pick<ContrastProps, "mode"> & {
  label: string
  value: string
  queries: URLSearchParams
}

const ColorInput: FC<ColorInputProps> = ({
  label,
  value: valueProp,
  queries,
}) => {
  const [value, setValue] = useState<string>(valueProp)

  useUpdateEffect(() => {
    setValue(valueProp)
  }, [valueProp])

  return (
    <VStack minW="12.5rem" w="auto" flex="1" gap="xs">
      <Text as="span" color="muted" fontSize="sm">
        {label}
      </Text>

      <ColorPicker
        value={value}
        onChange={setValue}
        rounded="full"
        matchWidth
        eyeDropperProps={{ rounded: "full" }}
      />
    </VStack>
  )
}

type ContrastPreviewProps = Pick<ContrastProps, "fg" | "bg">

const ContrastPreview: FC<ContrastPreviewProps> = ({ fg, bg }) => {
  return (
    <VStack
      p={{ base: "lg", sm: "md" }}
      bg={bg}
      gap={{ base: "lg", sm: "normal" }}
    >
      <VStack gap={{ base: "sm", sm: "0" }}>
        <Text color={fg} fontSize="2xl" lineClamp={1}>
          Large Text
        </Text>

        <Text color={fg} lineClamp={1}>
          Small Text
        </Text>
      </VStack>

      <Wrap gap="md">
        <UIComponent color={bg} bg={fg} />

        <UIComponent color={fg} borderWidth="1px" borderColor={fg} />
      </Wrap>
    </VStack>
  )
}

type UIComponentProps = CenterProps

const UIComponent: FC<UIComponentProps> = ({ ...rest }) => {
  const { theme } = useTheme()

  return (
    <Center
      h={{ base: "10", sm: "8" }}
      fontSize={{ base: "md", sm: "sm" }}
      lineHeight={{ base: get(theme, "sizes.10"), sm: get(theme, "sizes.8") }}
      px={{ base: "4", sm: "3" }}
      rounded="full"
      cursor="pointer"
      {...rest}
    >
      <Text as="span">UI Component</Text>
    </Center>
  )
}

type SwitchButtonProps = Pick<ContrastProps, "mode" | "fg" | "bg"> & {
  queries: URLSearchParams
}

const SwitchButton: FC<SwitchButtonProps> = ({
  mode,
  fg,
  bg,
  queries: queriesProp,
}) => {
  const queries = new URLSearchParams(queriesProp)

  queries.set(`${mode}.fg`, bg.replace("#", ""))
  queries.set(`${mode}.bg`, fg.replace("#", ""))

  return (
    <IconButton
      as={Link}
      href={`/contrast-checker?${queries}`}
      icon={<Refresh boxSize={{ base: "1.3em", sm: "1em" }} />}
      border="none"
      minW={{ base: "8", sm: "6" }}
      h={{ base: "8", sm: "6" }}
      position="absolute"
      isRounded
      color={isLight(bg) ? "white" : "black"}
      bg={isLight(bg) ? "blackAlpha.800" : "whiteAlpha.800"}
      _hover={{
        bg: isLight(bg) ? "black" : "white",
      }}
      top={{ base: "md", sm: "md" }}
      right={{ base: "md", sm: "md" }}
    />
  )
}

type ContrastScoreProps = Pick<ContrastProps, "score" | "aa" | "aaa"> & {
  level: { aa: boolean; aaa: boolean }
}

const ContrastScore: FC<ContrastScoreProps> = ({ score, aa, aaa, level }) => {
  return (
    <VStack
      p={{ base: "lg", sm: "md" }}
      gap="sm"
      bg={["blackAlpha.50", "whiteAlpha.100"]}
      color="muted"
    >
      <Wrap alignItems="flex-start" gap="md">
        <Text
          color={["black", "white"]}
          fontSize={{ base: "6xl", sm: "5xl" }}
          fontWeight="bold"
          lineHeight={1}
        >
          {score.toFixed(1)}
        </Text>

        <Spacer />

        <Wrap gapX="lg" gapY="md" alignItems="flex-start">
          {level.aa ? (
            <Grid
              templateColumns="13ch auto 4ch"
              alignItems="center"
              gapX="sm"
              gapY={{ base: "sm", sm: "xs" }}
            >
              {level.aa && level.aaa ? (
                <GridItem as={Center} justifySelf="flex-start" colSpan={3}>
                  <Tag
                    size="sm"
                    variant="outline"
                    colorScheme="neutral"
                    fontSize={{ base: "sm", sm: "xs" }}
                    minH={{ base: 6, sm: 5 }}
                    lineHeight={1}
                  >
                    AA
                  </Tag>
                </GridItem>
              ) : null}

              <>
                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  Large Text
                </Text>

                {aa.large ? <Pass color="success" /> : <Fail color="danger" />}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aa.large ? "Pass" : "Fail"}
                </Text>

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  Small Text
                </Text>

                {aa.small ? <Pass color="success" /> : <Fail color="danger" />}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aa.small ? "Pass" : "Fail"}
                </Text>

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  UI Component
                </Text>

                {aa.component ? (
                  <Pass color="success" />
                ) : (
                  <Fail color="danger" />
                )}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aa.component ? "Pass" : "Fail"}
                </Text>
              </>
            </Grid>
          ) : null}

          {level.aaa ? (
            <Grid
              templateColumns="13ch auto 4ch"
              alignItems="center"
              gapX="sm"
              gapY={{ base: "sm", sm: "xs" }}
            >
              {level.aa && level.aaa ? (
                <GridItem as={Center} justifySelf="flex-start" colSpan={3}>
                  <Tag
                    size="sm"
                    variant="outline"
                    colorScheme="neutral"
                    fontSize={{ base: "sm", sm: "xs" }}
                    minH={{ base: 6, sm: 5 }}
                    lineHeight={1}
                  >
                    AAA
                  </Tag>
                </GridItem>
              ) : null}

              <>
                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  Large Text
                </Text>

                {aaa.large ? <Pass color="success" /> : <Fail color="danger" />}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aaa.large ? "Pass" : "Fail"}
                </Text>

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  Small Text
                </Text>

                {aaa.small ? <Pass color="success" /> : <Fail color="danger" />}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aaa.small ? "Pass" : "Fail"}
                </Text>

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  UI Component
                </Text>

                {aaa.component ? (
                  <Pass color="success" />
                ) : (
                  <Fail color="danger" />
                )}

                <Text fontSize={{ base: "md", sm: "sm" }} fontWeight="semibold">
                  {aaa.component ? "Pass" : "Fail"}
                </Text>
              </>
            </Grid>
          ) : null}
        </Wrap>
      </Wrap>
    </VStack>
  )
}
