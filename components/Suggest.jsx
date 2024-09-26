"use client"
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useAsyncList} from "@react-stately/data";

export default function Suggest({model, onChange}) {
  let list = useAsyncList({
    async load({signal, filterText}) {
      // let res = await fetch(`https://swapi.py4e.com/api/people/?search=${filterText}`);
      let res = await fetch(`/api/autocomplete?q=${filterText}&model=customers`, {signal});
      let json = await res.json();

      return {
        items: json.results,
      };
    },
  });

  return (
    <Autocomplete
      className="max-w-xs"
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label={`Select a ${model.replace(/s$/, '')}`}
      placeholder="Type to search..."
      variant="bordered"
      onInputChange={x => {
        list.setFilterText(x)

        // console.log({list})
      }}
      onSelectionChange={(name) => {
        onChange(list.items.find(x => x.name === name))
        // list.close()
      }}
    >
      {(item) => (
        <AutocompleteItem key={item.name} className="capitalize">
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}