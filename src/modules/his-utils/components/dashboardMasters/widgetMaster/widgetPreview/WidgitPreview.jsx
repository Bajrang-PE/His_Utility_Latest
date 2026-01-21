import { Label } from '../../../dragdrop/FormElements';
import Parameters from '../../../sidebar/Parameters';
import WidgitEngine from '../WidgitViewer/WidgitViewerEngine';

export default function WidgitPreview({
  isParameterRequired = false,
  paramData,
  widgitName,
  isNameVisible = "Yes",
  isPreviewTextVisible = true,
}) {
  return (
    <>
      {isPreviewTextVisible && <Label labelText={'Widgit Preview'} />}
      
      <div className="widgitMaster__preview">
        {isNameVisible === "Yes" && <h2 className="widgitMaster__preview--heading">{widgitName}</h2>}
        {isParameterRequired && <Parameters params={paramData?.map(dt => dt?.value)?.join(",")} scope={'tabParams'}/>}
        <WidgitEngine />
      </div>
    </>
  );
}
