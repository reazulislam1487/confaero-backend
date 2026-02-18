import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import httpStatus from "http-status";
import { super_admin_service } from "./superAdmin.service";

const create_new_organizer = catchAsync(async (req, res) => {
  const result = await super_admin_service.create_new_organizer_into_db(
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New organizer created successfully!",
    data: result,
  });
});


const create_event_by_super_admin = catchAsync(async (req, res) => {
  const result = await super_admin_service.create_event_by_super_admin_into_db(
    req.body,
  );

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

const get_all_organizers = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || undefined;
  const result = await super_admin_service.get_all_organizers_from_db(limit);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Organizers fetched successfully!",
    data: result,
  });
});

const get_specific_organizer = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_specific_organizer_from_db(
    req.params.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Organizer fetched successfully!",
    data: result,
  });
});

const get_all_events_of_organizer = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_all_events_of_organizer_from_db(
    req.params.id,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully!",
    data: result,
  });
});

const get_specific_event_of_organizer = catchAsync(async (req, res) => {
  const { organizerId, eventId } = req.params;

  const result =
    await super_admin_service.get_specific_event_of_organizer_from_db(
      organizerId,
      eventId,
    );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fetched successfully!",
    data: result,
  });
});

//   – Super Admin → All Events
const get_all_events = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || undefined;

  const result = await super_admin_service.get_all_events_from_db(limit);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All events fetched successfully!",
    data: result,
  });
});

// a event deatil

const get_event_details = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_single_event_details_from_db(
    req.params.eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event details fetched successfully!",
    data: result,
  });
});
const get_all_users = catchAsync(async (req, res) => {
  const { limit, page, search } = req.query;

  const result = await super_admin_service.get_all_users_from_db({
    limit: Number(limit),
    page: Number(page),
    search: search as string,
  });

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});
const get_user_details = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_user_details_from_db(
    req.params.userId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched successfully",
    data: result,
  });
});
const suspend_user = catchAsync(async (req, res) => {
  await super_admin_service.suspend_user_from_db(req.body?.email);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

const get_event_overview = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_event_overview_from_db(
    req.params.eventId,
  );

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event overview fetched successfully",
    data: result,
  });
});

const get_dashboard_overview = catchAsync(async (req, res) => {
  const result = await super_admin_service.get_dashboard_overview_from_db();

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard overview fetched successfully",
    data: result,
  });
});

export const super_admin_controller = {
  create_new_organizer,
  create_event_by_super_admin,
  get_all_organizers,
  get_specific_organizer,
  get_all_events_of_organizer,
  get_specific_event_of_organizer,
  get_all_events,
  get_all_users,
  get_user_details,
  suspend_user,
  get_event_overview,
  get_dashboard_overview,
  get_event_details,
};
