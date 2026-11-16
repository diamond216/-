import { LocalizedText } from "./LocalizedText";

export type PlatformId = "windows" | "mac" | "browser" | "android" | "ios" | "line" | "device";

/** Where something runs. */
export class Platform {
  static readonly WINDOWS = new Platform("windows", LocalizedText.same("Windows"));
  static readonly MAC = new Platform("mac", LocalizedText.same("Mac"));
  static readonly BROWSER = new Platform("browser", new LocalizedText("browser", "เบราว์เซอร์"));
  static readonly ANDROID = new Platform("android", LocalizedText.same("Android"));
  static readonly IOS = new Platform("ios", LocalizedText.same("iOS"));
  static readonly LINE = new Platform("line", new LocalizedText("LINE", "ไลน์"));
  static readonly DEVICE = new Platform("device", new LocalizedText("its own device", "อุปกรณ์ของมันเอง"));

  private static readonly registry: readonly Platform[] = [
    Platform.WINDOWS,
    Platform.MAC,
    Platform.BROWSER,
    Platform.ANDROID,
    Platform.IOS,
    Platform.LINE,
    Platform.DEVICE,
  ];

  private constructor(
    readonly id: PlatformId,
    readonly label: LocalizedText,
  ) {}

  static byId(id: string): Platform | undefined {
    return Platform.registry.find((platform) => platform.id === id);
  }
}
