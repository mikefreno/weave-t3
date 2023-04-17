import { Loading } from "@nextui-org/react";
import { Server, User } from "@prisma/client/mongo";
import { useEffect, useState } from "react";

export default function Search(props: {
  userInput: string;
  previousInput?: string;
  userData?: User[];
  serverData?: Server[];
  select: (input: User) => void;
}) {
  const { userInput, userData, serverData, select } = props;
  const [userResults, setUserResults] = useState<User[] | null>(null);
  const [serverResults, setServerResults] = useState<Server[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInput.length > 2) {
      if (userData) {
        userFinder();
      } else if (serverData) {
        serverFinder();
      }
    }
  }, [userInput]);

  const userFinder = () => {
    setLoading(true);
    const results: User[] = [];
    if (userData) {
      for (let n = 0; n < userData.length; n++) {
        if (
          userData[n]?.name?.toLowerCase().includes(userInput.toLowerCase())
        ) {
          results.push(userData[n] as User);
          continue;
        }
        if (results.length >= 5) break;
        if (
          userData[n]?.pseudonym
            ?.toLowerCase()
            .includes(userInput.toLowerCase())
        ) {
          results.push(userData[n] as User);
        }
        if (results.length >= 5) break;
      }
      setUserResults(results);
    }
    setLoading(false);
  };

  const serverFinder = () => {
    const results: Server[] = [];
    if (serverData) {
      for (let n = 0; n < serverData.length; n++) {
        if (
          serverData[n]?.name?.toLowerCase().includes(userInput.toLowerCase())
        ) {
          results.push(serverData[n] as Server);
        }
        if (results.length >= 5) break;
      }
      setServerResults(results);
    }
  };

  return (
    <div className="-mt-3 rounded-b-lg bg-zinc-100 dark:bg-zinc-900">
      <div className="px-2 pb-2 pt-4">
        {!loading ? (
          userResults ? (
            userResults.map((result) => (
              <div className="py-1" key={result.id}>
                <button
                  onClick={() => select(result)}
                  className="w-full rounded bg-purple-300 py-2 hover:bg-purple-400 active:bg-purple-500 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
                >
                  <div className="text-md">{result.name}</div>
                  <div className="text-sm">
                    {result.pseudonym ? "@" + result.pseudonym : null}
                  </div>
                </button>
              </div>
            ))
          ) : serverResults ? (
            serverResults.map((result) => (
              <div className="w-full rounded bg-zinc-800" key={result.id}>
                <div></div>
                <div></div>
              </div>
            ))
          ) : (
            <div className="italic">No results found...</div>
          )
        ) : (
          <div className="flex justify-center">
            <Loading type="points" />
          </div>
        )}
      </div>
    </div>
  );
}
