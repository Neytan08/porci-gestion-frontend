/** 
 * This is a model file for the Farrowing feature, which defines the data structures used in the application.
 */

/**
 * Represents a farrowing event.
 */
export type Farrowing = {
	farrowing_id: number;
	sow_id: number;
	mating_id: number;
	farrowing_date: string;
	male_piglets: number | null;
	female_piglets: number | null;
	live_births: number | null;
	still_births: number | null;
	mummies: number | null;
	weaning_date: string | null;
	weaned_date: string | null;
	weaned_piglets: number | null;
	notes?: string | null;
};

/**
 * Represents the payload required to create a new farrowing event. This type is used when sending data to the API to create a new farrowing record.
 */
export type CreateFarrowingPayload = {
	sow_id: number;
	farrowing_date: string;
	male_piglets: number;
	female_piglets: number;
	still_births: number;
	mummies: number;
	notes?: string | null;
};

/** Payload used to record the actual weaning of a farrowing. */
export type WeanFarrowingPayload = {
	weaned_date: string;
	weaned_piglets: number;
};

/**
 * Represents the response from the API when fetching farrowings for a specific sow. This type includes the sow ID, the total count of farrowings, and an array of Farrowing objects representing each farrowing event associated with the sow.
 */
export type FarrowingsBySowResponse = {
	sowId: number;
	count: number;
	farrowings: Farrowing[];
};
