using Asp.Versioning;
using HotelBooking.Application.Common.Models.Payment;
using HotelBooking.Application.Features.Checkout.Commands.HandlePaymentWebhook;
using HotelBooking.Application.Settings;
using HotelBooking.Infrastructure.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace HotelBooking.Api.Controllers;

/// <summary>
/// Portfolio / demo-mode payment endpoint.
/// Only active when Payment:Mode = "Mock" in configuration.
/// Simulates a successful Stripe payment without contacting Stripe.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/payment")]
public sealed class MockPaymentController(
    ISender sender,
    IOptions<MockPaymentSettings> mockOptions,
    IOptions<PaymentUrlSettings> urlOptions,
    ILogger<MockPaymentController> logger)
    : ControllerBase
{
    private readonly MockPaymentSettings _mock = mockOptions.Value;
    private readonly PaymentUrlSettings _urls = urlOptions.Value;

    /// <summary>
    /// Simulates a successful payment confirmation.
    /// Called when the user "pays" in portfolio/demo mode.
    /// Introduces a brief delay, marks the booking as paid, then redirects
    /// the browser to the frontend success page.
    /// </summary>
    [HttpGet("mock-confirm/{bookingId:guid}")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MockConfirm(
        Guid bookingId,
        [FromQuery] string sessionId,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            return BadRequest("sessionId is required.");

        logger.LogInformation(
            "[MockPayment] Confirming mock payment for booking {BookingId}, session {SessionId}",
            bookingId, sessionId);

        // Simulate payment-processor delay so the portfolio demo feels realistic
        if (_mock.ProcessingDelayMs > 0)
            await Task.Delay(_mock.ProcessingDelayMs, ct);

        var webhookEvent = new WebhookParseResult(
            IsSignatureValid: true,
            EventType: PaymentEventTypes.PaymentSucceeded,
            ProviderSessionId: sessionId,
            TransactionRef: $"mock_txn_{bookingId:N}",
            RawPayload: $"{{\"mock\":true,\"bookingId\":\"{bookingId}\"}}");

        var result = await sender.Send(new HandlePaymentWebhookCommand(webhookEvent), ct);

        if (result.IsError)
        {
            logger.LogWarning(
                "[MockPayment] HandlePaymentWebhookCommand returned error for booking {BookingId}: {Error}",
                bookingId, result.TopError);
        }

        var successUrl = string.Format(_urls.SuccessUrlTemplate, bookingId);

        logger.LogInformation(
            "[MockPayment] Redirecting to success page: {Url}", successUrl);

        return Redirect(successUrl);
    }
}
