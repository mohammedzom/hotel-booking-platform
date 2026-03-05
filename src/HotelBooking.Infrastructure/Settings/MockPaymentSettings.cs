namespace HotelBooking.Infrastructure.Settings;

public sealed class MockPaymentSettings
{
    public const string SectionName = "MockPayment";

    /// <summary>
    /// URL template for the mock-confirm endpoint.
    /// {0} = BookingId, {1} = SessionId
    /// Example: "https://api.just-atta.site/api/v1/payment/mock-confirm/{0}?sessionId={1}"
    /// </summary>
    public string ConfirmUrlTemplate { get; init; } = string.Empty;

    /// <summary>
    /// Simulated processing delay in milliseconds (shown to the user).
    /// </summary>
    public int ProcessingDelayMs { get; init; } = 2000;
}
