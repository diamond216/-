import { CoverArt, type Picture } from "@/domain";
import { CoverArtView } from "../common/CoverArtView";

/** Shows a picture whatever it is: a generated cover, or a photo the maker just picked. Decorative. */
export function PictureView({ picture }: { picture: Picture }) {
  if (picture instanceof CoverArt) return <CoverArtView art={picture} />;
  return (
    <div className="cover cover--photo" aria-hidden="true">
      {/* A local object URL: next/image can't optimise it in a static export, and doesn't need to. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={picture.url} alt="" />
    </div>
  );
}
