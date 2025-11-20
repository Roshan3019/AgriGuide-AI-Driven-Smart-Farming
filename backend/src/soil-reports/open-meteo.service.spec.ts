import { Test, TestingModule } from '@nestjs/testing';
import { OpenMeteoService } from './open-meteo.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenMeteoService', () => {
  let service: OpenMeteoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenMeteoService],
    }).compile();

    service = module.get<OpenMeteoService>(OpenMeteoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchOpenMeteoData', () => {
    it('should return weather data when API call succeeds', async () => {
      // Mock successful API response
      const mockApiResponse = {
        status: 200,
        data: {
          current: {
            temperature_2m: 28.5,
            relative_humidity_2m: 65,
            wind_speed_10m: 3.2,
            rain: 1.5,
            soil_moisture_0_1cm: 0.25,
            soil_temperature_0cm: 24.3,
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.fetchOpenMeteoData(28.6139, 77.2090);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        expect.objectContaining({
          params: expect.objectContaining({
            latitude: 28.6139,
            longitude: 77.2090,
          }),
        })
      );

      expect(result).toEqual({
        temperature: 28.5,
        humidity: 65,
        windSpeed: 3.2,
        rainfall: 1.5,
        soilMoisture: 0.25,
        soilTemperature: 24.3,
      });
    });

    it('should return null values when API data is incomplete', async () => {
      // Mock API response with missing data
      const mockApiResponse = {
        status: 200,
        data: {
          current: {
            temperature_2m: 25.0,
            // Missing other fields
          },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

      const result = await service.fetchOpenMeteoData(28.6139, 77.2090);

      expect(result).toEqual({
        temperature: 25.0,
        humidity: null,
        windSpeed: null,
        rainfall: null,
        soilMoisture: null,
        soilTemperature: null,
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await service.fetchOpenMeteoData(28.6139, 77.2090);

      // Should return null values instead of throwing
      expect(result).toEqual({
        temperature: null,
        humidity: null,
        windSpeed: null,
        rainfall: null,
        soilMoisture: null,
        soilTemperature: null,
      });
    });
  });
});
