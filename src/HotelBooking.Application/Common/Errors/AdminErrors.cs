using HotelBooking.Domain.Common.Results;

namespace HotelBooking.Application.Common.Errors;

public static class AdminErrors
{
    public static class Cities
    {
        public static readonly Error NotFound =
            Error.NotFound("Admin.Cities.NotFound", "City not found.");

        public static readonly Error AlreadyExists =
            Error.Conflict("Admin.Cities.AlreadyExists",
                "A city with the same name and country already exists.");

        public static readonly Error HasRelatedHotels =
            Error.Conflict("Admin.Cities.HasRelatedHotels",
                "Cannot delete city because it has related hotels.");
    }
}