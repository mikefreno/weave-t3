import ShieldIcon from "@/src/icons/ShieldIcon";

const SecurityModal = (props: { isDarkTheme: boolean }) => {
  const { isDarkTheme } = props;

  return (
    <div className={`z-50 max-w-[40vw] rounded-2xl p-1 backdrop-blur ${isDarkTheme ? "darkBorder" : "lightBorder"}`}>
      <div
        className={`${isDarkTheme ? "transparentZinc800" : "transparentZinc300"} rounded-2xl p-4 shadow-2xl md:w-60`}
      >
        <span className="flex justify-center">
          <ShieldIcon height={144} width={144} fill={isDarkTheme ? "#f4f4f5" : "#27272a"} />
        </span>
        <div className="text-[#171717] dark:text-[#E2E2E2]">
          <h3 className="text-md text-center">Control Your Data Flow</h3>
          <p className="text-center text-sm">
            Soft requests allow the user to not share the requested info but still join the group, hard requests must be
            accepted to join. (Full Name, current activity, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
