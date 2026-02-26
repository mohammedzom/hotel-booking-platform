using HotelBooking.Application.Common.Interfaces;
using HotelBooking.Application.Common.Models;
using HotelBooking.Contracts.Auth;
using HotelBooking.Domain.Common.Results;
using MediatR;

namespace HotelBooking.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler(
    IIdentityService identityService,
    ITokenProvider tokenProvider)
    : IRequestHandler<LoginCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var result = await identityService.ValidateCredentialsAsync(cmd.Email, cmd.Password, ct);
        if (result.IsError)
            return result.TopError;

        var user = result.Value;

        var tokenResult = await tokenProvider.GenerateTokenPairAsync(
            new AppUserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Roles), ct:ct);

        if (tokenResult.IsError)        
            return tokenResult.TopError;

        return new AuthResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Roles.FirstOrDefault() ?? "User", 
            user.CreatedAt,
            tokenResult.Value);
    }
}