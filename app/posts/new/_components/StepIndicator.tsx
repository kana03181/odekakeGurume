
type Props = {
  step: 1 | 2;
};

export const StepIndicator = ({ step }: Props) => {
    return (
    <div className="mt-6 mb-18">
      <p className="text-center text-xs posts-indicator-text font-medium">STEP {step}/2</p>

      <div className="mx-auto mt-2 flex w-32 gap-2">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-orange-400" : "bg-gray-200"}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-orange-400" : "bg-gray-200"}`} />
      </div>
    </div>
  )
}
