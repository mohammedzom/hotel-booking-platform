using HotelBooking.Application.Common.Interfaces;
using HotelBooking.Application.Common.Models.Payment;
using HotelBooking.Application.Settings;
using HotelBooking.Infrastructure.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HotelBooking.Infrastructure.Payment;

/// <summary>
/// Portfolio / demo payment gateway — no real Stripe calls are made.
/// Returns a URL to the backend mock-confirm endpoint which immediately
/// marks the booking as paid and redirects the user to the success page.
/// </summary>
public sealed class MockPaymentGateway(
    IOptions<PaymentUrlSettings> urlOptions,
    IOptions<MockPaymentSettings> mockOptions,
    ILogger<MockPaymentGateway> logger)
    : IPaymentGateway
{
    private readonly PaymentUrlSettings _urls = urlOptions.Value;
    private readonly MockPaymentSettings _mock = mockOptions.Value;

    public string ProviderName => "Mock";

    public Task<PaymentSessionResponse> CreatePaymentSessionAsync(
        PaymentSessionRequest request,
        CancellationToken ct = default)
    {
        var sessionId = $"mock_{request.BookingId:N}_{Guid.CreateVersion7():N}";

        // The confirm URL hits a dedicated API endpoint that marks the payment
        // as succeeded and then redirects back to the frontend success page.
        var confirmUrl = string.Format(
            _mock.ConfirmUrlTemplate,
            request.BookingId,
            sessionId);

        logger.LogInformation(
            "[MockPaymentGateway] Created mock payment session {SessionId} for booking {BookingId}. " +
            "Confirm URL: {ConfirmUrl}",
            sessionId,
            request.BookingId,
            confirmUrl);

        return Task.FromResult(new PaymentSessionResponse(
            SessionId: sessionId,
            PaymentUrl: confirmUrl));
    }

    public Task<WebhookParseResult> ParseWebhookAsync(
        string rawPayload,
        string signature,
        CancellationToken ct = default)
    {
        // Mock gateway does not use webhooks — always return invalid so the real
        // webhook endpoint rejects stray calls.
        return Task.FromResult(new WebhookParseResult(
            IsSignatureValid: false,
            EventType: string.Empty,
            ProviderSessionId: null,
            TransactionRef: null,
            RawPayload: rawPayload));
    }

    public Task<RefundResponse> RefundAsync(
        string transactionRef,
        decimal amount,
        string idempotencyKey,
        CancellationToken ct = default)
    {
        logger.LogInformation(
            "[MockPaymentGateway] Simulated refund of {Amount} USD for transaction {TxRef}",
            amount, transactionRef);

        return Task.FromResult(new RefundResponse(
            IsSuccess: true,
            RefundId: $"mock_refund_{Guid.CreateVersion7():N}",
            ErrorMessage: null));
    }

    public Task ExpirePaymentSessionAsync(string sessionId, CancellationToken ct = default)
    {
        logger.LogInformation(
            "[MockPaymentGateway] Simulated expiry of mock session {SessionId}", sessionId);

        return Task.CompletedTask;
    }
}
