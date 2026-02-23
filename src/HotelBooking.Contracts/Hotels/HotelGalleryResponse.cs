namespace HotelBooking.Contracts.Hotels;

public sealed record ImageDto(
    Guid Id,
    string Url,
    string? AltText,
    string ImageType);

public sealed record HotelGalleryResponse(
    Guid HotelId,
    List<ImageDto> Images);