import Xmark from "@/src/icons/Xmark";
import { api } from "@/src/utils/api";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { RefObject, useRef, useState } from "react";

interface DeleteServerConfirmationProps {
  setOwnerConfirmedDeletion: React.Dispatch<React.SetStateAction<boolean>>;
  deleteConfirmationModalRef: RefObject<HTMLDivElement>;
  serverDeletionToggle: () => void;
  serverName: string | undefined;
  serverId: number | undefined;
}

export default function DeleteServerConfirmation(props: DeleteServerConfirmationProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<string>();
  const delistServer = api.server.delistServer.useMutation();

  const checkInput = async (event: any) => {
    event.preventDefault();
    if (props.serverId) {
      if (inputRef.current?.value === props.serverName) {
        const res = await delistServer.mutateAsync(props.serverId);
        setReport(res);
      } else {
        setReport("Incorrect server name");
      }
    } else setReport("Data load error, refresh page and try again");
  };

  return (
    <div className="fade-in fixed flex h-screen w-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
      <div
        ref={props.deleteConfirmationModalRef}
        className="fade-in -mt-24 w-11/12 rounded-xl bg-zinc-50 px-8 py-4 shadow-2xl dark:bg-zinc-900 sm:w-2/3 md:w-1/2 xl:w-1/3"
      >
        <button className="-ml-4" onClick={props.serverDeletionToggle}>
          <Xmark className="h-10 w-10" />
        </button>
        <div className="text-center text-2xl text-rose-600">Are you sure you want to delete this server?</div>
        <form onSubmit={checkInput}>
          <div className="flex justify-center py-10">
            <div className="flex flex-col">
              <Input ref={inputRef} status="error" labelPlaceholder="Enter Server Name" />
              <div className="text-center italic text-rose-600">{report}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Tooltip content={"This will initiate a 24 hour countdown to server deletion"}>
              <Button color={"error"} auto type="submit">
                Confirm Deletion
              </Button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
}
