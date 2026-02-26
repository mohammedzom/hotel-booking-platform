using HotelBooking.Application.Common.Interfaces;
using HotelBooking.Domain.Common.Results;
using MediatR;

namespace HotelBooking.Application.Features.Auth.Commands.LogoutAllSessions;

public sealed class LogoutAllSessionsCommandHandler(
    IRefreshTokenRepository refreshTokenRepo)
    : IRequestHandler<LogoutAllSessionsCommand, Result<Success>>
{
    public async Task<Result<Success>> Handle(LogoutAllSessionsCommand cmd, CancellationToken ct)
    {
        await refreshTokenRepo.RevokeAllForUserAsync(cmd.UserId, ct);
        await refreshTokenRepo.SaveChangesAsync(ct);

        return HotelBooking.Domain.Common.Results.Result.Success;
    }
}