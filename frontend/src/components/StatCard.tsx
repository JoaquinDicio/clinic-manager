type Props = {
  title: string;
  value: number | string;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className="h-2 w-2 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}
