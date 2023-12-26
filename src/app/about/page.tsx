import Container from "@/components/ui/container";

type Props = {};

const page = (props: Props) => {
  return (
    <Container>
      <div className="w-full items-center justify-center gap-8 p-8">
        <Item
          q="what is this"
          a="This is a companion uploader app for cc0-lib.wtf"
        />
        <Item
          q="is this free?"
          a="yes, UPLOAD EXPENSES ARE FUNDED BY THE CC0-LIB FUND POOL WITH THE
          SUPPORT OF NOUNS DAO (PROP 343)"
        />

        <Item
          q="why do i need to connect wallet?"
          a="we need it to sync your uploads to your wallet address. we will be using ENS to identify your wallet address"
        />
        <Item
          q="what is ens?"
          a="ens is an ethereum name service. it is a human readable name for your wallet address. you can get one for free here https://ens.vision/name/cc0-gang"
        />
      </div>
    </Container>
  );
};

export default page;

const Item = ({ q, a }: { q: string; a: string }) => {
  return (
    <div className="p-4">
      <h1 className="max-w-prose text-lg text-prim">{q}</h1>
      <p>{a}</p>
    </div>
  );
};
