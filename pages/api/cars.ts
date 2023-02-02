import errorHandler from "@/errors/error-handler";
import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { PipelineStage } from "mongoose";
import Car from "@/models/Car";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "GET") {
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	return filter(req, res);
};

const filter = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await dbConnect();

		// Get the query params
		let { page, make, model, color } = req.query;

		// Page as a number
		let pageNum = 1;

		// Validate the page number
		if (page) {
			const val = parseInt(page as string);

			if (!isNaN(val)) {
				pageNum = val;
			}
		}

		// console.log("brand", brand);

		// // Build the match filter
		// const matchFilter: {
		// 	brand?: { $in: string[] };
		// } = {};

		// if (brand && brand.length > 0) {

		// 	// Split the brand string into an array
		// 	brand = (brand as string).split("-");

		// 	// Matches any of the brands in the brand array
		// 	matchFilter["brand"] = { $in: brand };
		// }

		// Build the match filter
		const matchFilter: {
			make?: string;
			model?: { $in: string[] };
			color?: { $in: string[] };
		} = {};

		// Make
		if (make && make.length > 0) {
			// Matches any of the brands in the brand array
			matchFilter["make"] = make as string;
		}

		// Model
		if (model && model.length > 0) {
			// Split the brand string into an array
			model = (model as string).split("-");

			// Matches any of the brands in the brand array
			matchFilter["model"] = { $in: model };
		}

		// Color
		if (color && color.length > 0) {
			// Split the color string into an array
			color = (color as string).split("-");

			// Matches any of the colors in the color array
			matchFilter["color"] = { $in: color };
		}

		const aggregate: PipelineStage[] = [];

		aggregate.push({ $match: matchFilter });
		aggregate.push({
			$facet: {
				cars: [{ $skip: (pageNum - 1) * 10 }, { $limit: 10 }],
				metadata: [{ $count: "count" }, { $addFields: { page: pageNum } }],
			},
		});
		aggregate.push({ $limit: 10 });

		const cars = await Car.aggregate(aggregate);
		res.status(200).json(cars);
	} catch (err) {
		errorHandler(err, res);
	}
};

export default handler;
