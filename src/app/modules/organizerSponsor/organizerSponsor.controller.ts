import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { organizer_sponsor_service } from "./organizerSponsor.service";

const get_all_sponsors = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const result = await organizer_sponsor_service.get_all_sponsors_from_db({
    ...req.params,
    page,
    limit,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsors fetched successfully",
    data: result,
  });
});

const get_single_sponsor = catchAsync(async (req, res) => {
  const result = await organizer_sponsor_service.get_single_sponsor_from_db(
    req.params.sponsorId as string,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor details fetched successfully",
    data: result,
  });
});

const approve_sponsor = catchAsync(async (req, res) => {
  const result = await organizer_sponsor_service.approve_sponsor_into_db(
    req.params.sponsorId as string,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor approved successfully",
    data: result,
  });
});

const reject_sponsor = catchAsync(async (req, res) => {
  const result = await organizer_sponsor_service.reject_sponsor_into_db(
    req.params.sponsorId as string,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor rejected successfully",
    data: result,
  });
});

export const organizer_sponsor_controller = {
  get_all_sponsors,
  get_single_sponsor,
  approve_sponsor,
  reject_sponsor,
};
