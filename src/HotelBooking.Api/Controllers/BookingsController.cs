using HotelBooking.Application.Common.Interfaces;
using HotelBooking.Application.Features.Checkout.Queries.GetBooking;
using HotelBooking.Contracts.Checkout;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.Api.Controllers;

[Authorize]
public sealed class BookingsController(ISender sender, IUser currentUser) : ApiController
{
    /// <summary>
    /// Retrieves booking details by ID.
    /// The authenticated user must be the booking owner, or an Admin.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(BookingDetailsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBooking(Guid id, CancellationToken ct)
    {
        if (!Guid.TryParse(currentUser.Id, out var userId))
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");

        var result = await sender.Send(new GetBookingQuery(id, userId, isAdmin), ct);
        return result.Match(Ok, Problem);
    }
}