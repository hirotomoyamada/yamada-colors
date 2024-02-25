import { noop } from "@yamada-ui/react"
import {
  createContext,
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import type { PropsWithChildren, FC } from "react"
import { CONSTANT } from "constant"
import type { ColorFormat } from "utils/color"
import { deleteCookie, generateUUID, getCookie, setCookie } from "utils/storage"

type AppContext = {
  hex?: string | [string, string]
  format?: ColorFormat
  palettes: ColorPalettes
  changeFormat: (format: ColorFormat) => void
  createPalette: (name: string) => void
  changePalette: (palette: ColorPalette) => void
  deletePalette: (uuid: string) => void
}

const AppContext = createContext<AppContext>({
  hex: undefined,
  format: undefined,
  palettes: [],
  changeFormat: noop,
  createPalette: noop,
  changePalette: noop,
  deletePalette: noop,
})

export type AppProviderProps = PropsWithChildren<{
  hex?: string | [string, string]
  format?: ColorFormat
  palettes?: ColorPalettes
}>

export const AppProvider: FC<AppProviderProps> = ({
  hex,
  format: formatProp,
  palettes: palettesProp = [],
  children,
}) => {
  const [format, setFormat] = useState<ColorFormat>(formatProp)
  const [palettes, setPalettes] = useState<ColorPalettes>(palettesProp)

  const createPalette = useCallback((name: string) => {
    const uuid = generateUUID()

    setCookie(
      `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
      JSON.stringify({
        uuid,
        name: encodeURIComponent(name),
        colors: [],
      }),
    )

    setPalettes((prev) => [
      {
        uuid,
        name,
        colors: [],
      },
      ...prev,
    ])
  }, [])

  const changePalette = useCallback(({ uuid, name, colors }: ColorPalette) => {
    console.log("run")

    setCookie(
      `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
      JSON.stringify({
        uuid,
        name: encodeURIComponent(name),
        colors,
      }),
    )

    setPalettes((prev) =>
      prev.map((palette) => {
        if (palette.uuid === uuid) {
          return { ...palette, name, colors }
        } else {
          return palette
        }
      }),
    )
  }, [])

  const deletePalette = useCallback((uuid: string) => {
    deleteCookie(`${CONSTANT.STORAGE.PALETTE}-${uuid}`)

    setPalettes((prev) => prev.filter((palette) => palette.uuid !== uuid))
  }, [])

  const changeFormat = useCallback((format: ColorFormat) => {
    setFormat(format)
    setCookie(CONSTANT.STORAGE.FORMAT, format)
  }, [])

  useEffect(() => {
    const format = getCookie<ColorFormat>(
      document.cookie,
      CONSTANT.STORAGE.FORMAT,
      "hex",
    )

    if (formatProp !== format) setFormat(format)
  }, [formatProp])

  const value = useMemo(
    () => ({
      hex,
      format,
      palettes,
      changeFormat,
      createPalette,
      changePalette,
      deletePalette,
    }),
    [
      hex,
      format,
      palettes,
      changeFormat,
      createPalette,
      changePalette,
      deletePalette,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
