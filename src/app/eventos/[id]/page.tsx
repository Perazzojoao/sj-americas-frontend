import Tables from "@/components/Tables";
import { getTableList } from "@/services";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EventPage = async ({ params }: EventPageProps) => {
  const { id } = await params;
  const tableList = await getTableList(parseInt(id));
  return (
    <div className="px-3 sm:px-4 lg:px-5 lg:w-4/5 xl:w-4/6 mx-auto mb-8">
      <Tables eventId={parseInt(id)} tableList={tableList} />
    </div>
  );
};

export default EventPage;