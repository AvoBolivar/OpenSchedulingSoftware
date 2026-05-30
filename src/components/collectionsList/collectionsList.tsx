import ReadCollections from "./readCollections";

export default function CollectionsList() {
  return (
    <div>
      <ReadCollections type="Collection"/>
      <ReadCollections type="PayOut"/>
    </div>
  )
}