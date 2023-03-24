import LoadingElement from "@/src/components/loading";
import Navbar from "@/src/components/Navbar";
import ThemeContext from "@/src/components/ThemeContextProvider";
import { api } from "@/src/utils/api";
import { Button, Input, Loading, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useRef, useState } from "react";

export default function PrivacyPolicy() {
  const switchRef = useRef<HTMLDivElement>(null);
  const { isDarkTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [submitState, setSubmitState] = useState<boolean>(false);

  const sendContactRequestMutation = api.misc.sendContactRequest.useMutation();

  const submitForm = async (e: any) => {
    e.preventDefault();
    if (
      nameInputRef.current &&
      emailInputRef.current &&
      messageInputRef.current
    ) {
      setSubmitState(true);
      const res = await sendContactRequestMutation.mutateAsync({
        name: nameInputRef.current.value,
        email: emailInputRef.current.value,
        message: messageInputRef.current.value,
      });
      if (res === 201) {
        setResponseText(
          "Message sent successfully, we will get back a soon as possible!"
        );
      } else {
        console.log(res + "error");
      }
    }
    setSubmitState(false);
  };

  if (status === "loading") {
    return (
      <>
        <LoadingElement isDarkTheme={isDarkTheme} />
      </>
    );
  } else {
    return (
      <>
        <div className="bg-zinc-100 dark:bg-zinc-900">
          <Head>
            <title>Contact Us | Weave</title>
            <meta name="description" content="Weave's Privacy Policy" />
          </Head>
          <Navbar switchRef={switchRef} />
          <div className="flex min-h-screen justify-center">
            <div className="pt-[20vh]">
              <div className="text-center text-3xl tracking-widest">
                Contact
              </div>
              <form onSubmit={submitForm}>
                <div className="mt-24">
                  <div className="flex">
                    <div className="px-8">
                      <Input
                        ref={nameInputRef}
                        clearable
                        underlined
                        labelPlaceholder="Your Name"
                        required
                        color="secondary"
                        initialValue={
                          session?.user?.name ? session.user.name : ""
                        }
                      />
                    </div>
                    <Input
                      ref={emailInputRef}
                      clearable
                      underlined
                      labelPlaceholder="Your email"
                      required
                      color="secondary"
                      initialValue={
                        session?.user?.email ? session.user.email : ""
                      }
                    />
                  </div>
                  <div className="pt-12 pl-7">
                    <Textarea
                      ref={messageInputRef}
                      size="lg"
                      css={{
                        width: "100%",
                      }}
                      required
                      status="secondary"
                      labelPlaceholder="Enter Your Message"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    {submitState ? (
                      <Button auto shadow ghost ripple color={"secondary"}>
                        <Loading type="points" />
                      </Button>
                    ) : (
                      <Button
                        auto
                        shadow
                        ghost
                        ripple
                        type="submit"
                        color={"secondary"}
                      >
                        Send Message
                      </Button>
                    )}
                  </div>
                  <div className="mx-auto w-3/4 pt-6">
                    <div className="text-center">{responseText}</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
