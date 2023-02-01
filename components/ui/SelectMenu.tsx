import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Listbox, Menu, Popover } from "@headlessui/react";

export interface DropdownFilterState {
	[key: string]: {
		label: string;
		value: boolean;
	};
}

interface SelectMenuParams {
	default: string;
	className?: string;
	value?: string;
	initialize?: boolean;
	options: string[] | null;
	onValueChange: (value: string | undefined) => void;
}

export default function SelectMenu(props: SelectMenuParams) {
	const [value, setValue] = React.useState(props.value ? props.value : props.default);

	useEffect(() => {
		if (props.value) {
			setValue(props.value);
		}
	}, [props.value]);

	const renderOption = (option: string) => {
		return (
			<Listbox.Option
				key={option}
				value={option}
				className={({ active, selected }) =>
					`relative cursor-default select-none py-2 pl-6 pr-4 ${
						active ? "bg-slate-100 text-slate-900" : "text-slate-900"
					} ${selected ? "font-semibold bg-slate-100" : "font-normal"}`
				}
			>
				{option}
			</Listbox.Option>
		);
	};

	let options = props.options?.map((option) => renderOption(option));
	options?.unshift(renderOption(props.default));

	return (
		<div className="w-52">
			<Listbox
				value={value}
				onChange={(value) => {
					setValue(value);

					if (value !== props.default) {
						props.onValueChange(value);
					} else {
						props.onValueChange(undefined);
					}
				}}
			>
				<div className="relative">
					<Listbox.Button
						className="inline-flex rounded bg-white px-3 py-2.5 font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm items-center w-full justify-between
					"
					>
						{value}
						<span className="inline-flex justify-center items-center ml-2">
							<svg
								className="h-5 w-5 text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
							</svg>
						</span>
					</Listbox.Button>
					<Listbox.Options className="absolute right-0 mt-1 origin-top-right rounded-md bg-white shadow-lg flex flex-col py-4 border max-h-96 overflow-auto w-full">
						{options}
					</Listbox.Options>
				</div>
			</Listbox>
		</div>
	);
}
