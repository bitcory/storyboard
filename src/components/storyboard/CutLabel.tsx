interface CutLabelProps {
  cutNumber: string;
}

export default function CutLabel({ cutNumber }: CutLabelProps) {
  return (
    <div className="w-[80px] shrink-0 flex items-center justify-center font-mono text-base text-muted-light">
      {cutNumber}
    </div>
  );
}
